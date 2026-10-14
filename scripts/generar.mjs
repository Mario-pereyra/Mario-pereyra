// Genera el banner de assets/ en tema oscuro y claro: `npm run assets`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMAS } from './lib/tema.mjs';
import { banner } from './piezas/banner.mjs';

const salida = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(salida, { recursive: true });

for (const [tema, paleta] of Object.entries(TEMAS)) {
	const svg = banner(paleta, tema);
	writeFileSync(join(salida, `banner-${tema}.svg`), svg);
	console.log(`banner-${tema}.svg  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}
