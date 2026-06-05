// Healthcheck for the quill-dev container.
// Replaces `curl -fsS http://127.0.0.1:8787/` without depending on curl/wget.
const port = process.env.PORT || '8787';
try {
  const res = await fetch(`http://127.0.0.1:${port}/`);
  if (!res.ok) process.exit(1);
  process.exit(0);
} catch {
  process.exit(1);
}
