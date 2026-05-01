// Renders favicon.svg → favicon-32.png, favicon-16.png, apple-touch-icon.png,
// icon-192.png, icon-512.png. Plus assembles a multi-size favicon.ico.
//
// Avoids the SPA-rewrite catching `/favicon.ico` and serving the index shell —
// which confuses crawlers, RSS readers, and bookmarking.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const svgPath = join(root, 'public', 'favicon.svg');

const svg = await readFile(svgPath, 'utf8');

async function renderPng(size, filename) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  });
  const png = resvg.render().asPng();
  const out = join(root, 'public', filename);
  await writeFile(out, png);
  console.log(`  ${filename.padEnd(28)} ${size}×${size}  ${png.byteLength.toLocaleString()} bytes`);
  return png;
}

console.log('Rendering icon variants from favicon.svg:');

await renderPng(16, 'favicon-16.png');
await renderPng(32, 'favicon-32.png');
await renderPng(180, 'apple-touch-icon.png');
await renderPng(192, 'icon-192.png');
await renderPng(512, 'icon-512.png');

// Assemble a minimal favicon.ico (single 32×32 PNG inside ICO container).
// Most modern browsers accept PNG-payload ICOs.
const png32 = await readFile(join(root, 'public', 'favicon-32.png'));

const ICO_HEADER_SIZE = 6;
const ICO_DIR_ENTRY_SIZE = 16;
const PNG_OFFSET = ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE;
const totalSize = PNG_OFFSET + png32.length;
const ico = Buffer.alloc(totalSize);

// ICONDIR header
ico.writeUInt16LE(0, 0);          // Reserved (must be 0)
ico.writeUInt16LE(1, 2);          // Type (1 = ICO)
ico.writeUInt16LE(1, 4);          // Image count

// ICONDIRENTRY (single entry)
ico.writeUInt8(32, 6);            // Width (32)
ico.writeUInt8(32, 7);            // Height (32)
ico.writeUInt8(0, 8);             // Color count (0 = >=256 / no palette)
ico.writeUInt8(0, 9);             // Reserved
ico.writeUInt16LE(1, 10);         // Color planes
ico.writeUInt16LE(32, 12);        // Bits per pixel
ico.writeUInt32LE(png32.length, 14); // Image data size
ico.writeUInt32LE(PNG_OFFSET, 18);   // Offset to image data

// Embed the PNG bytes
png32.copy(ico, PNG_OFFSET);

await writeFile(join(root, 'public', 'favicon.ico'), ico);
console.log(`  favicon.ico                  32×32       ${ico.length.toLocaleString()} bytes`);
console.log('Done.');
