# The Motortrade Accountants — two Next.js PPC templates

This package contains the current Norwich location design and VAT margin scheme design, converted into editable React components in one Next.js project. All current page images and logos are included.

## Run locally

Use Node.js 20.9 or later (Node.js 22 or 24 recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:4173/ for the template chooser.

| Template | Route |
|---|---|
| Norwich location | `/lp/norwich/` |
| Automotive wording | `/lp/norwich/?kw=automotive` |
| VAT margin scheme | `/lp/margin-scheme/` |
| VAT research wording | `/lp/margin-scheme/?kw=vat-margin-scheme` |
| Second-hand wording | `/lp/margin-scheme/?kw=second-hand` |

Unknown or missing keyword values fall back to the default. Headline, form heading and browser title are rendered on the server using the query parameter, so there is no initial flash of the default wording. There is no navigation between PPC pages; the root page is just an export chooser.

## Production build and hosting

```sh
npm run build
npm start
```

The production server defaults to http://localhost:3000/ and accepts the host's `PORT` environment variable. Deploy to a Node-compatible Next.js host (for example, Vercel or a Render Node web service). On Render use `npm ci && npm run build` as the build command and `npm start` as the start command.

This is a Next.js server project, not a static HTML export. Query-dependent server rendering requires a server. Cloudflare Pages static-only hosting cannot run this project as-is; a compatible Next.js Workers adapter would be needed. The original static website and its deployment have not been changed by this export.

`node_modules` and `.next` are excluded. `package-lock.json` pins the tested dependency versions.

## Editable files

- `templates/LocationTemplate.jsx`: Norwich page layout and copy.
- `templates/MarginTemplate.jsx`: VAT page layout and copy, including the redesigned “Under one roof” section.
- `components/Site.jsx` and `components/TrustBand.jsx`: shared header, footer, FAQs, trust band and compact header behaviour.
- `components/LeadForm.jsx`: full/short enquiry forms, preview dialogue, attribution fields, sticky mobile actions and shared check state.
- `components/Interactive.jsx`: service tabs, image cards, grouped challenges and five-point margin scheme self-check.
- `data/content.json`: services, sectors, challenges and FAQ copy.
- `lib/keywords.js`: keyword variants and defaults.
- `styles/globals.css`: shared and location styling.
- `styles/margin.css`: VAT-specific styling.
- `public/assets/`: supplied branding, photographs from the existing site and the generated image set.

To add another location, copy the Norwich route and template, then replace the city, local content, FAQs and hidden city field. No additional city claims or offices have been generated.

## Forms — read before launch

The export preserves the design preview's demo-only submission behaviour by default: valid submissions open a dialogue, and no enquiry is sent or saved. Click-to-call links are active.

An optional integration point is provided in `.env.example`. Copy it to `.env.local` and set `NEXT_PUBLIC_LEAD_ENDPOINT` only after a real endpoint has been built and tested. The form sends JSON via POST; cross-origin endpoints need suitable CORS support. A successful HTTP 2xx response triggers `NEXT_PUBLIC_THANK_YOU_URL` if set, or displays a submitted message. Configure public environment variables before building.

The endpoint must independently validate input, protect against spam (including Turnstile), enforce rate limits and deliver/save enquiries. Email delivery, D1 backup, Calendly, consent management, forwarding numbers, enhanced conversions and advertising/analytics tags are not implemented. No tracking tags are loaded.

Payloads include the page, normalised keyword variant, city for the location form, landing URL, timestamp, current URL click IDs and UTM fields. The VAT form includes the self-check score and answered count; an unanswered check has an empty score. Newsletter consent is separate and unticked on the full location form. The endpoint must enforce this consent.

## Content and images

Both templates have `noindex,follow` metadata. FAQs and all page copy render in server HTML. The self-check's questions and radio controls are present without JavaScript; scoring requires JavaScript. Native FAQs open and close without JavaScript. The location service explorer supports keyboard arrows, Home and End.

The six cards and image in the VAT page's final service section are included. The location page retains the lower turnover bands and all approved wording changes.

Generated photographs are illustrative images, not portraits of actual staff or clients. Existing site branding and the `forecourt.webp` final-CTA background are copied from the original website: confirm appropriate reuse rights before production. Other original stock assets are included for continuity; remove unused files as desired. Fonts currently load from Google Fonts using the existing brand weights.

Before campaign launch confirm the free-check scope (review period, written summary and fix plan) and replace the Google review placeholders with verified named reviews and ratings. The £20,000 case study remains a general tax result; it is not claimed as a VAT margin scheme recovery.

HMRC sources used for the VAT page, checked 17 November 2026:
- https://www.gov.uk/guidance/buying-and-selling-second-hand-motor-vehicles-using-the-vat-margin-scheme
- https://www.gov.uk/guidance/how-to-work-out-the-margin-and-vat-due-using-vat-margin-schemes
- https://www.gov.uk/vat-margin-schemes/keeping-records

Recheck these rules before launch. This package does not create or launch Google Ads campaigns.

## Validation performed for this export

- `npm run build` passed with both landing pages registered as server-rendered routes.
- Server-rendered output checked for all five keyword variants and unknown-value fallbacks.
- Approved location wording, lower turnover options, FAQ schema, self-check controls, worked example and redesigned VAT services section checked in server HTML.
- The converted build has not had a fresh browser/viewport pass: the managed preview launcher supplies Vite-only flags that Next.js does not accept. The earlier static design previews were visually reviewed separately.
