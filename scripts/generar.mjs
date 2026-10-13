// Genera los SVG de assets/ en tema oscuro y claro: `npm run assets`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMAS } from './lib/tema.mjs';
import { portada } from './piezas/portada.mjs';
import { botones, desplegables } from './piezas/botones.mjs';
import { resumen } from './piezas/resumen.mjs';
import { figura } from './piezas/figura.mjs';
import { proyectos } from './piezas/proyectos.mjs';
import { stack } from './piezas/stack.mjs';
import { pie } from './piezas/pie.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const salida = join(raiz, 'assets');
mkdirSync(salida, { recursive: true });

const piezas = { portada, boton: botones, desplegable: desplegables, resumen, figura, proyecto: proyectos, stack, pie };
const solo = process.argv.slice(2);

for (const [nombre, crear] of Object.entries(piezas)) {
	if (solo.length && !solo.includes(nombre)) continue;
	for (const [tema, paleta] of Object.entries(TEMAS)) {
		// Una pieza devuelve un SVG o un objeto { sufijo: svg } cuando son varios archivos.
		const resultado = crear(paleta, tema);
		const archivos = typeof resultado === 'string' ? { '': resultado } : resultado;
		for (const [sufijo, svg] of Object.entries(archivos)) {
			const base = sufijo ? `${nombre}-${sufijo}` : nombre;
			writeFileSync(join(salida, `${base}-${tema}.svg`), svg);
			console.log(`${base}-${tema}.svg  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
		}
	}
}
