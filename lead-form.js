// POST /api/lead: enquiries from the PPC landing page forms (/lp/), sent into the CRM.
//
// The forms (lp-templates/components/LeadForm.jsx) post their fields as JSON to this same-origin route. It checks
// them and passes them to the CRM's website form route (inbound-webform-email, JSON path) with the form key of the
// "Motortrade Accountants PPC Landing Pages" channel, so these leads are tracked separately from the main website
// form and the enquiry bot. The CRM creates the lead in the client's pipeline and emails the channel's alert
// address (Justin while testing; enquire@themotortradeaccountants.co.uk at launch).
//
// The page address sent to the CRM keeps the ad click (gclid / ag / UTM), so the CRM links the lead to the ad.

const CRM_FORMS_URL = "https://dipjypzrfigkzuarlsov.supabase.co/functions/v1/inbound-webform-email";
const LP_FORM_KEY = "d4b7e1a9-2c3f-4e58-9a61-0b7c5d2e8f34"; // CRM channel: Motortrade Accountants PPC Landing Pages

const LABELS = [
  ["name", "Name"], ["phone", "Phone"], ["email", "Email"],
  ["business", "Business type"], ["turnover", "Annual turnover"],
  ["cars_sold", "Cars sold per month"], ["vat_registered", "VAT registered"],
  ["self_check_score", "Self-check score"], ["self_check_answered", "Self-check questions answered"],
  ["newsletter", "Newsletter"], ["city", "Landing page area"], ["kw", "Landing page wording"],
];
const TRACKING = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

const txt = (v, n) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
const json = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

// Turn the form's fields into what the CRM stores: a subject, "Label: value" details, the email and the page.
export function leadFromForm(body, siteUrl) {
  const f = Object.fromEntries(Object.entries(body || {}).map(([k, v]) => [k, txt(v, 500)]));
  const name = txt(f.name, 120), phone = txt(f.phone, 40), email = txt(f.email, 254).toLowerCase();
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return { error: "Please enter your name." };
  if (digits.length < 10 || digits.length > 15) return { error: "Please enter a valid phone number." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };

  // The landing page address, on this site only, with the ad click and UTM tags kept.
  let page;
  try { page = new URL(f.landing_url || "", siteUrl); } catch { page = new URL("/lp/", siteUrl); }
  if (page.host !== new URL(siteUrl).host || !page.pathname.startsWith("/lp/")) page = new URL("/lp/", siteUrl);
  for (const k of TRACKING) if (f[k] && !page.searchParams.has(k)) page.searchParams.set(k, f[k]);

  f.name = name; f.phone = phone; f.email = email;
  const where = f.page === "margin-scheme" ? "VAT margin scheme" : f.city === "UK" || !f.city ? "UK" : f.city;
  const subject = `PPC landing page: ${where}`;
  const lines = LABELS.filter(([k]) => f[k]).map(([k, label]) => `${label}: ${k === "newsletter" ? (f[k] === "yes" ? "Yes, opted in" : f[k]) : f[k]}`);
  lines.push(`Form: ${f.page === "margin-scheme" ? "Free margin scheme check" : "Free discovery call"} (${page.pathname})`);
  return { subject, details: lines.join("\n"), email, name, page_url: page.toString() };
}

export async function handleLead(request, env = {}) {
  if (request.method !== "POST") return json({ error: "POST required" }, 405);
  const url = new URL(request.url);
  // Same-site posts only (the forms on the /lp/ pages).
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== url.host) return json({ error: "Not allowed" }, 403);
  if (Number(request.headers.get("content-length") || 0) > 20000) return json({ error: "Too large" }, 413);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "Invalid form" }, 400);

  const lead = leadFromForm(body, `${url.protocol}//${url.host}`);
  if (lead.error) return json({ error: lead.error }, 400);

  const monitor = body.monitor === true ? { monitor: true, monitor_token: txt(body.monitor_token, 200) } : {};
  const res = await fetch(env.CRM_FORMS_URL || CRM_FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_key: env.LP_FORM_KEY || LP_FORM_KEY, ...lead, ...monitor }),
  }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
  if (!res.ok) {
    console.error("CRM lead not created", res.status, await res.text().catch(() => ""));
    return json({ error: "We couldn't send your request." }, 502);
  }
  return json({ ok: true, ...(monitor.monitor ? { monitor: true } : {}) });
}
