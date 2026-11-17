// Worker in front of the static copy of themotortradeaccountants.co.uk.
//
// 1. Tidies a few legacy URLs (www → root, /home → /, /contact → /contact-us/).
// 2. Serves the static files in ./public.
// 3. Passes the bits that need a live WordPress server (form submissions via
//    admin-ajax.php, the REST API, and any wp-content file not in the copy)
//    through to WP_ORIGIN, so the forms and newsletter keep working.
// 4. Marks the workers.dev preview address as noindex so it can't compete
//    with the live site in Google.

const REDIRECTS = {
  "/home": "/",
  "/home/": "/",
  "/contact": "/contact-us/",
  "/contact/": "/contact-us/",
};

const PROXY_PREFIXES = ["/wp-admin/admin-ajax.php", "/wp-json/"];
const FALLBACK_PREFIXES = ["/wp-content/", "/wp-includes/"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    const to = REDIRECTS[url.pathname];
    if (to) return Response.redirect(new URL(to + url.search, url).toString(), 301);

    const origin = env.WP_ORIGIN ? new URL(env.WP_ORIGIN) : null;
    // Never proxy to ourselves (e.g. after the live domain is pointed here).
    const canProxy = origin && origin.hostname !== url.hostname;

    if (canProxy && PROXY_PREFIXES.some((p) => url.pathname.startsWith(p))) {
      return withHeaders(await proxy(request, url, origin), url);
    }

    let res = await env.ASSETS.fetch(request);
    if (
      res.status === 404 &&
      canProxy &&
      FALLBACK_PREFIXES.some((p) => url.pathname.startsWith(p))
    ) {
      res = await proxy(request, url, origin);
    }
    return withHeaders(res, url);
  },
};

async function proxy(request, url, origin) {
  const target = new URL(url.pathname + url.search, origin);
  const headers = new Headers(request.headers);
  headers.set("Host", origin.host);
  if (headers.has("Origin")) headers.set("Origin", origin.origin);
  const ref = headers.get("Referer");
  if (ref) {
    const r = new URL(ref);
    headers.set("Referer", new URL(r.pathname + r.search, origin).toString());
  }
  return fetch(target, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    redirect: "manual",
  });
}

function withHeaders(res, url) {
  if (!url.hostname.endsWith(".workers.dev")) return res;
  const out = new Response(res.body, res);
  out.headers.set("X-Robots-Tag", "noindex, nofollow");
  return out;
}
