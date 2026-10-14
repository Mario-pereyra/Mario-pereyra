// Genera el banner y las baldosas propias de assets/ en tema oscuro y claro, y escribe la tabla
// del stack en el README entre <!-- stack:inicio --> y <!-- stack:fin -->: `npm run assets`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMAS } from './lib/tema.mjs';
import { banner } from './piezas/banner.mjs';
import { baldosa } from './piezas/baldosas.mjs';
import { FILAS, ICONOS } from './datos/stack.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const salida = join(raiz, 'assets');
mkdirSync(join(salida, 'iconos'), { recursive: true });

function escribir(nombre, svg) {
	writeFileSync(join(salida, nombre), svg);
	console.log(`${nombre}  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
}

for (const [tema, paleta] of Object.entries(TEMAS)) {
	escribir(`banner-${tema}.svg`, banner(paleta, tema));
	for (const [id, icono] of Object.entries(ICONOS)) if (!icono.skill) escribir(`iconos/${id}-${tema}.svg`, baldosa(icono, tema));
}

// Tabla del stack: cada ícono es su propia imagen, con el nombre en `title` (tooltip) y en `alt`.
const imagen = (id) => {
	const { nombre } = ICONOS[id];
	const ruta = (tema) => `assets/iconos/${id}-${tema}.svg`;
	return `<picture><source media="(prefers-color-scheme: dark)" srcset="${ruta('oscuro')}"><source media="(prefers-color-scheme: light)" srcset="${ruta('claro')}"><img src="${ruta('claro')}" alt="${nombre}" title="${nombre}" width="36" height="36"></picture>`;
};
const celda = (ids, texto = []) => [...ids.map(imagen), ...texto.map((t) => `<code>${t}</code>`)].join('\n      ');

const tabla = [
	'<table>',
	'  <tr>',
	'    <th width="20%"></th>',
	'    <th width="40%" align="left"><code>ya_manejo</code></th>',
	'    <th width="40%" align="left"><code>aprendiendo</code></th>',
	'  </tr>',
	...FILAS.flatMap((f) => [
		'  <tr>',
		`    <td><code>${f.area}:</code></td>`,
		`    <td>\n      ${celda(f.ya)}\n    </td>`,
		`    <td>\n      ${celda(f.aprendiendo, f.texto)}\n    </td>`,
		'  </tr>',
	]),
	'</table>',
].join('\n');

const rutaReadme = join(raiz, 'README.md');
const readme = readFileSync(rutaReadme, 'utf8');
const eol = readme.includes('\r\n') ? '\r\n' : '\n';
const marcas = /(<!-- stack:inicio -->)[\s\S]*?(<!-- stack:fin -->)/;
if (!marcas.test(readme)) throw new Error('README.md: faltan las marcas <!-- stack:inicio --> y <!-- stack:fin -->');
writeFileSync(rutaReadme, readme.replace(marcas, (_, a, b) => [a, ...tabla.split('\n'), b].join(eol)));
console.log('README.md  tabla del stack');
