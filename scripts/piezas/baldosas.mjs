// Baldosas propias del stack, con la misma forma, tamaño y fondo que las de skill-icons para que combinen.
// Dos clases: `logo` mete el logo original de scripts/datos/logos/ en la baldosa; `letras` escribe
// un nombre corto en Geist Mono Bold, como las baldosas TS y JS, para lo que no tiene logo.
// Logos: Claude, OpenAI, TypeORM, React Router y TOTVS de simple-icons (CC0); SQL Server de devicon (MIT);
// MCP, DeepSeek y Zhipu de lobehub/icons (MIT); OpenCode de sst/opencode (MIT); Pi de pi.dev.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const opentype = require('opentype.js');
const aqui = dirname(fileURLToPath(import.meta.url));
const carpetaLogos = join(aqui, '..', 'datos', 'logos');
const negrita = opentype.loadSync(join(aqui, '..', '..', 'node_modules', 'geist', 'dist', 'fonts', 'geist-mono', 'GeistMono-Bold.ttf'));

const LADO = 256;
const FONDO = { oscuro: '#242938', claro: '#F4F2ED' };
const TINTA = { oscuro: '#FFFFFF', claro: '#242938' };
const ACENTO = {
	naranja: { oscuro: '#F28C28', claro: '#C25E00' },
	azul: { oscuro: '#5EA8F2', claro: '#1F6FB2' },
};

const porTema = (valor, tema) => (valor && typeof valor === 'object' ? valor[tema] : valor);
const r2 = (n) => Math.round(n * 100) / 100;

/** El logo como un <svg> anidado: conserva su viewBox y sus defs; sin título ni estilos propios. */
function logo({ archivo, relleno, tam }, tema) {
	const fuente = readFileSync(join(carpetaLogos, porTema(archivo, tema)), 'utf8');
	const viewBox = fuente.match(/viewBox="([^"]+)"/)[1];
	const interior = fuente
		.replace(/^[\s\S]*?<svg[^>]*>/, '')
		.replace(/<\/svg>\s*$/, '')
		.replace(/<title>[\s\S]*?<\/title>/g, '')
		.replace(/<style>[\s\S]*?<\/style>/g, '');
	const color = porTema(relleno, tema);
	const m = (LADO - tam) / 2;
	return `<svg x="${m}" y="${m}" width="${tam}" height="${tam}" viewBox="${viewBox}"${color ? ` fill="${color}"` : ''}>${interior}</svg>`;
}

/** Un texto centrado en x, como trazado, del tamaño que entre en `ancho`. */
function trazo(texto, { x, y, tam, ancho, color }) {
	const t = Math.min(tam, (ancho / negrita.getAdvanceWidth(texto, 100)) * 100);
	const w = negrita.getAdvanceWidth(texto, t);
	return `<path fill="${color}" d="${negrita.getPath(texto, r2(x - w / 2), r2(y), t).toPathData(2)}"/>`;
}

function letras({ texto, previo, color }, tema) {
	const acento = ACENTO[color][tema];
	const partes = [];
	if (previo) partes.push(trazo(previo, { x: LADO / 2, y: 92, tam: 40, ancho: 120, color: TINTA[tema] }));
	partes.push(trazo(texto, { x: LADO / 2, y: previo ? 178 : 160, tam: 96, ancho: 196, color: acento }));
	return partes.join('');
}

export function baldosa(icono, tema) {
	const contenido = icono.logo ? logo(icono.logo, tema) : letras(icono.letras, tema);
	return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 ${LADO} ${LADO}" fill="none" role="img">
<title>${icono.nombre}</title>
<rect width="${LADO}" height="${LADO}" rx="60" fill="${FONDO[tema]}"/>
${contenido}
</svg>
`;
}
