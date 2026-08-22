// Source-of-truth retrieval: validates user-supplied URLs and extracts plain
// text for injection into generation prompts. Used as the fallback path when
// Gemini's native url_context tool is unavailable (see gemini.ts).

const MAX_SOURCES = 5;
const MAX_SOURCE_CHARS = 8000;
const MAX_HTML_BYTES = 400_000;
const FETCH_TIMEOUT_MS = 10_000;
const MIN_USEFUL_TEXT = 200;

export function sanitizeSourceUrls(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const out: string[] = [];
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!trimmed || trimmed.length > 2048 || out.length >= MAX_SOURCES)
      continue;
    let u: URL;
    try {
      u = new URL(trimmed);
    } catch {
      continue;
    }
    if (u.protocol !== "https:" && u.protocol !== "http:") continue;
    const host = u.hostname.toLowerCase();
    // Block non-public targets: localhost, bare hostnames, raw IPs,
    // link-local/metadata ranges and internal suffixes.
    if (!host.includes(".")) continue;
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) continue;
    if (
      /^(10|127|0)\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^192\.168\./.test(host)
    )
      continue;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) continue;
    if (
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      host === "metadata.google.internal"
    )
      continue;
    const normalized = u.toString();
    if (!out.includes(normalized)) out.push(normalized);
  }
  return out;
}

interface SourceMaterial {
  url: string;
  title: string;
  text: string;
}

class SkipElementHandler {
  private depth = 0;
  element(el: Element) {
    this.depth++;
    el.onEndTag(() => {
      this.depth--;
    });
  }
  text(_t: Text) {
    /* skipped */
  }
  get skipping(): boolean {
    return this.depth > 0;
  }
}

async function extractReadableText(
  html: string,
): Promise<{ title: string; text: string }> {
  let title = "";
  const chunks: string[] = [];
  const skip = new SkipElementHandler();
  const rewriter = new HTMLRewriter()
    .on("title", {
      text(t: Text) {
        title += t.text;
      },
    })
    .on("script,style,noscript,template,svg,iframe", skip)
    .on("body", {
      text(t: Text) {
        if (!skip.skipping && t.text) chunks.push(t.text);
      },
    });
  // The rewriter only runs while the transformed body is being consumed.
  await rewriter.transform(new Response(html)).text();
  return {
    title: title.trim().slice(0, 300),
    text: chunks.join("").replace(/\s+/g, " ").trim(),
  };
}

async function fetchSource(url: string): Promise<SourceMaterial | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; QuillAI/1.0; +https://quill.glassgallery.my.id)",
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5",
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml|text\/plain/.test(contentType))
      return null;

    let body: string;
    if (contentType.includes("text/plain")) {
      body = (await res.text()).slice(0, MAX_SOURCE_CHARS);
      return { url, title: "", text: body };
    }

    // Read at most MAX_HTML_BYTES to avoid buffering huge pages.
    const reader = res.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder();
    let html = "";
    let received = 0;
    while (received < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel().catch(() => {});

    const extracted = await extractReadableText(html);
    if (extracted.text.length < MIN_USEFUL_TEXT) return null;
    return {
      url,
      title: extracted.title,
      text: extracted.text.slice(0, MAX_SOURCE_CHARS),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Fetches all sources in parallel and formats them as a numbered SOURCE MATERIAL
// block for prompt injection. Returns '' when nothing usable was retrieved.
export async function buildSourceContext(urls: string[]): Promise<string> {
  if (!urls.length) return "";
  const results = await Promise.all(urls.map(fetchSource));
  const usable = results.filter((r): r is SourceMaterial => r !== null);
  if (!usable.length) return "";
  const sections = usable
    .map(
      (s, i) =>
        `[${i + 1}] ${s.title || s.url}\nURL: ${s.url}\nCONTENT:\n${s.text}`,
    )
    .join("\n\n---\n\n");
  return `\n\nSOURCE MATERIAL — the user supplied these verified references. Ground every factual claim strictly in this material and cite inline using the [n] notation:\n\n${sections}`;
}
