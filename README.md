# The Motortrade Accountants — static copy

A static copy of https://themotortradeaccountants.co.uk (WordPress), taken 17 Nov 2026, served as a Cloudflare Worker with static assets.

- `public/` — the 27 pages and every image, PDF, stylesheet, script and font they use, with links rewritten to work on any domain.
- `worker.js` — redirects a few old URLs, serves `public/`, and passes form submissions (`/wp-admin/admin-ajax.php`), the WP REST API and any missing `wp-content` file through to the live WordPress site (`WP_ORIGIN` in `wrangler.jsonc`). Adds `noindex` on the workers.dev preview address.

## PPC landing page templates

`lp-templates/` holds the two Next.js PPC templates (Norwich location and VAT margin scheme). On every deploy, `wrangler deploy` runs `npm run build:lp`: it builds them as a static export and copies `lp/`, `_next/` and `assets/` into `public/`. Those folders are generated, so they're git-ignored.

| Page | URL | Variant links (redirect to) |
| --- | --- | --- |
| National (launch) | `/lp/uk/` | `?kw=automotive` → `/lp/uk/automotive/`, `?kw=dealership` → `/lp/uk/dealership/`, `?kw=used-car` → `/lp/uk/used-car/` |
| Norwich location | `/lp/norwich/` | `?kw=automotive` → `/lp/norwich/automotive/` |
| VAT margin scheme | `/lp/margin-scheme/` | `?kw=vat-margin-scheme` → `/lp/margin-scheme/vat-margin-scheme/`, `?kw=second-hand` → `/lp/margin-scheme/second-hand/` |

The redirects keep every query parameter (gclid, UTM), and all `/lp/` pages send `X-Robots-Tag: noindex`. The forms are still in demo mode (they open a confirmation dialogue and send nothing) until `NEXT_PUBLIC_LEAD_ENDPOINT` is set at build time; see `lp-templates/README.md`.

To add a city: add an entry to `lp-templates/lib/places.js`, copy `lp-templates/pages/lp/norwich/` to `pages/lp/<slug>/` and change the slug, then add the base path to `LP_VARIANTS` in `worker.js` if it has keyword variants.

## Run and deploy

```bash
npm install
npm run dev      # http://localhost:8787
npm run deploy   # wrangler deploy
```

In Cloudflare: **Workers & Pages → Create → Import a repository** and pick this repo. No build command is needed; the deploy command is `npx wrangler deploy`.

## Before moving the live domain here

1. Forms, the newsletter signup and the cookie banner icons still rely on WordPress. Either move WordPress to its own host (e.g. `wp.themotortradeaccountants.co.uk`) and set `WP_ORIGIN` to it, or replace the forms with a static-friendly service.
2. Fluent Forms security tokens are baked into the copied HTML and expire; re-copy the pages or swap the forms before relying on them long term.
3. Uncomment the `routes` block in `wrangler.jsonc` and deploy.

The pages still include the site's Google Tag Manager, Google Ads and Microsoft Clarity tags, so visits to the copy show up in those accounts.
