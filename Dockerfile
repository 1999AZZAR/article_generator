# syntax=docker/dockerfile:1.7

# Quill dev container — runs `wrangler dev` on 0.0.0.0:8787
#
# Production lives behind the Cloudflare Tunnel at https://quill.glassgallery.my.id
# This image is the local origin for that tunnel during development.
#
# Build:
#   docker build -t quill-dev .
#
# Run with the existing host-based cloudflared (tunnel origin = localhost:8787):
#   docker run -d --name quill-dev -p 127.0.0.1:8787:8787 --restart unless-stopped \
#     -v quill-data:/app/.wrangler quill-dev
#
# Or use the bundled compose file (also creates a `tunnel` network you can attach
# cloudflared to if you ever run it in a container):
#   docker compose up -d
#
# Verify:
#   docker compose ps                    # STATUS = healthy
#   curl -fsS http://127.0.0.1:8787/     # returns the HTML page
#   # Tunnel will proxy https://quill.glassgallery.my.id -> http://quill-dev:8787
#
# NOTE: We rely on `init: true` in compose (or `--init` for raw `docker run`) to
# install Docker's bundled tini as PID 1. workerd is a glibc ELF binary, so the
# base image must be Debian-based (slim) rather than Alpine (musl).

ARG NODE_VERSION=20

# =====================================================================
# Stage 1: install dependencies (cached unless package*.json changes)
# =====================================================================
FROM node:${NODE_VERSION}-slim AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --no-audit --no-fund

# =====================================================================
# Stage 2: runtime (slim, non-root, glibc for workerd, init via compose)
# =====================================================================
FROM node:${NODE_VERSION}-slim AS runtime

WORKDIR /app

# System CA bundle is required by `workerd` (Cloudflare's JS runtime) so that
# outbound HTTPS calls — e.g. to the Gemini API — can verify TLS certificates.
# Without this, every Gemini call fails with
# "TLS peer's certificate is not trusted; unable to get local issuer certificate"
# and the app silently falls back to template responses.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Pull node_modules from the deps stage
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Project sources (anything not excluded by .dockerignore)
COPY --chown=node:node package.json package-lock.json* ./
COPY --chown=node:node wrangler.jsonc ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node prisma.config.ts ./
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node docker/healthcheck.mjs ./docker/healthcheck.mjs

# Wrangler writes to /app/.wrangler; make sure node can write there
RUN mkdir -p /app/.wrangler && chown -R node:node /app

ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=8787

EXPOSE 8787

# Node-based healthcheck (no curl/wget needed)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["node", "docker/healthcheck.mjs"]

USER node

CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "8787"]
