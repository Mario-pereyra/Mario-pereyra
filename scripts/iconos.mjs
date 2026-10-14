// Descarga de skillicons.dev (licencia MIT, ver assets/iconos/LICENCIAS.md) un SVG por ícono y tema
// y los guarda en assets/iconos/, así el README no depende del servicio: `npm run iconos`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ICONOS } from './datos/stack.mjs';

const TEMAS = { oscuro: 'dark', claro: 'light' };

const salida = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'iconos');
mkdirSync(salida, { recursive: true });

for (const [id, { skill }] of Object.entries(ICONOS)) {
	if (!skill) continue;
	for (const [tema, theme] of Object.entries(TEMAS)) {
		const respuesta = await fetch(`https://skillicons.dev/icons?i=${skill}&theme=${theme}`);
		if (!respuesta.ok) throw new Error(`${id} (${tema}): HTTP ${respuesta.status}`);
		const svg = await respuesta.text();
		if (!svg.trimStart().startsWith('<svg') || /<script/i.test(svg)) throw new Error(`${id} (${tema}): respuesta inesperada`);
		writeFileSync(join(salida, `${id}-${tema}.svg`), svg);
		console.log(`iconos/${id}-${tema}.svg`);
	}
}
