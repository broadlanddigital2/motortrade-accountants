// Copies the static landing pages built by lp-templates (Next.js export in lp-templates/out)
// into ./public, next to the copied website. Only /lp/, /_next/ and /assets/ are copied, so the
// templates' chooser page (out/index.html) never replaces the site's homepage.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'lp-templates', 'out');
const pub = join(root, 'public');

if (!existsSync(out)) throw new Error('lp-templates/out not found. Run the Next.js build first.');

for (const dir of ['lp', '_next', 'assets']) {
  const from = join(out, dir);
  const to = join(pub, dir);
  rmSync(to, { recursive: true, force: true });
  if (existsSync(from)) {
    cpSync(from, to, { recursive: true });
    console.log(`copied ${dir}/`);
  }
}
