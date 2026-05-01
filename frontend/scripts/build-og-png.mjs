// Renders public/og-image.svg → public/og-image.png at 1200×630.
// Run via `npm run build:og` (post-install / post-edit). The PNG is required
// because Facebook and WhatsApp don't render SVG OG images; Twitter, LinkedIn,
// Slack, iMessage handle either.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const svgPath = join(root, 'public', 'og-image.svg');
const pngPath = join(root, 'public', 'og-image.png');

const svg = await readFile(svgPath, 'utf8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
  background: '#0B1224',
});

const png = resvg.render().asPng();
await writeFile(pngPath, png);

console.log(`✓ wrote ${pngPath} (${png.byteLength.toLocaleString()} bytes)`);
