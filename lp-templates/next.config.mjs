/** @type {import('next').NextConfig} */
// Static export: every page and keyword variant is built to plain HTML in ./out,
// then copied into ../public by ../scripts/copy-lp.mjs and served by the Cloudflare Worker.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};
export default nextConfig;
