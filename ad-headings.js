// Page headings per Google Ads ad group, set in the CRM (Marketing → Ads → campaign → Page headings, or the campaign
// builder). Same system as the Race Car Graphics website.
//
// Every ad click arrives with ?ag=<ad group id> (the campaign's final URL suffix). When that ad group has a heading for
// this exact /lp/ page, the Worker changes the heading for that visitor only:
//   - location pages (/lp/uk/, /lp/norwich/): the keyword line ("Used Car Dealer"), so it still reads "… Accountants across the UK."
//   - other pages (/lp/margin-scheme/): the whole H1
//   - and, if set, the line under it.
// It changes both the HTML and the page's Next.js props (__NEXT_DATA__ adHeading / adLead, which the templates read),
// so React shows the same wording when it loads. Everyone else, other pages and unknown ag values get the page as built.
//
// The heading is read from the CRM's ad_landing_headings table (public read) when an ad click arrives, cached for 5
// minutes. If the CRM can't be reached in time, the page is served unchanged.

const SITE_ID = "126ca1ed-9a97-489a-b835-066392a3ce81"; // seo_sites: Motor Trade Accountants
const CRM_URL = "https://dipjypzrfigkzuarlsov.supabase.co";
const CRM_KEY = "sb_publishable_KLK1Ucd9ilVSwzSGL1vkug_3SGGh4NF"; // publishable key: read-only, public tables

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Next.js writes __NEXT_DATA__ with these characters escaped.
const jsonForHtml = (v) => JSON.stringify(v).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
export const pathOf = (pathname) => pathname.replace(/\/+$/, "") || "/";

export function adGroupOf(url) {
  return (url.searchParams.get("ag") || "").replace(/\D/g, "").slice(0, 20);
}

// The heading for this ad group from the CRM, or null.
export async function fetchHeading(ag, env = {}) {
  const base = env.CRM_SUPABASE_URL || CRM_URL, key = env.CRM_SUPABASE_KEY || CRM_KEY;
  const url = `${base}/rest/v1/ad_landing_headings?select=path,h1,subheading&site_id=eq.${SITE_ID}&ad_group_id=eq.${ag}&limit=1`;
  try {
    const res = await fetch(url, { headers: { apikey: key, Accept: "application/json" }, cf: { cacheTtl: 300, cacheEverything: true }, signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    const [row] = await res.json();
    return row && row.h1 ? row : null;
  } catch { return null; }
}

// Swap the heading in a built /lp/ page.
export function swapHeading(html, h) {
  let out = html, changed = false;
  const set = (re, value) => { const next = out.replace(re, (all, open, inner, close) => `${open}${esc(value)}${close}`); if (next !== out) { out = next; changed = true; return true; } return false; };
  // Location template: just the keyword line. Other templates: the whole H1.
  if (!set(/(<span id="keyword"[^>]*>)([\s\S]*?)(<\/span>)/, h.h1)) set(/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/, h.h1);
  if (h.subheading) set(/(<p class="(?:lead|margin-lead)"[^>]*>)([\s\S]*?)(<\/p>)/, h.subheading);
  if (!changed) return html;
  // The same wording in the page's props, so React keeps it when the page loads.
  return out.replace(/(<script id="__NEXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/, (all, a, json, c) => {
    try {
      const data = JSON.parse(json);
      data.props = data.props || {};
      data.props.pageProps = { ...(data.props.pageProps || {}), adHeading: h.h1, ...(h.subheading ? { adLead: h.subheading } : {}) };
      return a + jsonForHtml(data) + c;
    } catch { return all; }
  });
}

// Apply to a page response for an ad click with a heading for this page.
export async function withAdHeading(request, response, env, lookup = fetchHeading) {
  if (request.method !== "GET" || response.status !== 200) return response;
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;
  const url = new URL(request.url), ag = adGroupOf(url);
  if (!ag || !url.pathname.startsWith("/lp/")) return response;
  const h = await lookup(ag, env);
  if (!h || pathOf(url.pathname) !== pathOf(h.path || "")) return response;
  const html = swapHeading(await response.text(), h);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("etag");
  headers.set("x-ad-heading", "1");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}
