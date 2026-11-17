# The Motortrade Accountants — static copy

A static copy of https://themotortradeaccountants.co.uk (WordPress), taken 17 Nov 2026, served as a Cloudflare Worker with static assets.

- `public/` — the 27 pages and every image, PDF, stylesheet, script and font they use, with links rewritten to work on any domain.
- `worker.js` — redirects a few old URLs, serves `public/`, and passes form submissions (`/wp-admin/admin-ajax.php`), the WP REST API and any missing `wp-content` file through to the live WordPress site (`WP_ORIGIN` in `wrangler.jsonc`). Adds `noindex` on the workers.dev preview address.

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
