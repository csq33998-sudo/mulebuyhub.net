const allowedExternalHosts = new Set([
  "streetstyle.maisonlooks.com",
  "weidian.com",
  "www.weidian.com",
  "1688.com",
  "www.1688.com",
  "taobao.com",
  "www.taobao.com",
  "tmall.com",
  "www.tmall.com"
]);

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function safeExternalUrl(value: string | undefined, fallback = "https://streetstyle.maisonlooks.com/") {
  if (!value) return fallback;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !allowedExternalHosts.has(url.hostname)) {
      return fallback;
    }

    return url.toString();
  } catch {
    return fallback;
  }
}
