// Genera el banner y las baldosas de los agentes de assets/ en tema oscuro y claro: `npm run assets`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMAS } from './lib/tema.mjs';
import { banner } from './piezas/banner.mjs';
import { agentes } from './piezas/agentes.mjs';

const salida = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(salida, { recursive: true });

function escribir(nombre, svg) {
	writeFileSync(join(salida, nombre), svg);
	console.log(`${nombre}  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}

for (const [tema, paleta] of Object.entries(TEMAS)) {
	escribir(`banner-${tema}.svg`, banner(paleta, tema));
	escribir(`stack/agentes-${tema}.svg`, agentes(tema));
}
