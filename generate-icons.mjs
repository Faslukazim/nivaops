/**
 * Generates StayOps PWA icons from the logo SVG using @resvg/resvg-js.
 * Run: node generate-icons.mjs
 */
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

function makeSvg(size) {
  // All coordinates are in the 100x100 viewBox; width/height scale it to target size.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <rect width="100" height="100" fill="white"/>
  <path d="M26,68 C28,78 35,85 43,91 L78,64 Z" fill="#16A34A"/>
  <rect x="23" y="9" width="54" height="57" rx="9.5" fill="#0F1117"
        transform="rotate(-5, 50, 37)"/>
</svg>`;
}

const icons = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png',         size: 192 },
  { name: 'icon-512.png',         size: 512 },
];

for (const { name, size } of icons) {
  const svg = makeSvg(size);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  const png = resvg.render().asPng();
  fs.writeFileSync(`public/${name}`, png);
  console.log(`✓ public/${name}  (${size}×${size}, ${(png.length / 1024).toFixed(1)} KB)`);
}

console.log('\nDone. Commit public/ and deploy.');
