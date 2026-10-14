// Baldosas de los agentes de codificación (Claude Code, Codex, OpenCode y Pi) con la misma forma,
// tamaño y fondo que las de skill-icons, para que combinen en la tabla del stack.
// Los trazados se leen de los logos originales en scripts/datos/logos/: Claude y OpenAI de
// simple-icons (CC0), OpenCode de sst/opencode y Pi de pi.dev.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const carpeta = join(dirname(fileURLToPath(import.meta.url)), '..', 'datos', 'logos');
const trazados = (archivo) => [...readFileSync(join(carpeta, archivo), 'utf8').matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);

const LADO = 256;
const ESPACIO = 44;
const FONDO = { oscuro: '#242938', claro: '#F4F2ED' };

// Cada logo: su caja original, cuánto ocupa en la baldosa y el color de cada trazado por tema.
const LOGOS = [
	{ nombre: 'Claude Code', archivo: 'claude.svg', caja: [24, 24], tam: 150, colores: { oscuro: ['#D97757'], claro: ['#D97757'] } },
	{ nombre: 'Codex', archivo: 'openai.svg', caja: [24, 24], tam: 140, colores: { oscuro: ['#FFFFFF'], claro: ['#000000'] } },
	// OpenCode: primero el bloque interior y después el marco, que usa evenodd para dejar el hueco.
	{ nombre: 'OpenCode', archivo: 'opencode-dark.svg', caja: [240, 300], dx: 30, tam: 150, colores: { oscuro: ['#4B4646', '#F1ECEC'], claro: ['#CFCECD', '#211E1E'] } },
	{ nombre: 'Pi', archivo: 'pi.svg', caja: [560, 560], tam: 130, colores: { oscuro: ['#F6F6F6'], claro: ['#111111'] } },
];

function logo({ archivo, colores, caja, dx = 0 }, tema) {
	let lista = trazados(archivo);
	// En el archivo de OpenCode, el primer trazado es el rectángulo de la máscara: se descarta.
	if (archivo.startsWith('opencode')) lista = lista.slice(1);
	const paleta = colores[tema];
	const cuerpo = lista.map((d, i) => `<path fill-rule="evenodd" fill="${paleta[Math.min(i, paleta.length - 1)]}" d="${d}"/>`).join('');
	const lado = Math.max(caja[0] + dx * 2, caja[1]);
	return { cuerpo: dx ? `<g transform="translate(${dx} 0)">${cuerpo}</g>` : cuerpo, lado };
}

export function agentes(tema) {
	const ancho = LOGOS.length * LADO + (LOGOS.length - 1) * ESPACIO;
	const baldosas = LOGOS.map((l, i) => {
		const { cuerpo, lado } = logo(l, tema);
		const escala = l.tam / lado;
		const margen = (LADO - l.tam) / 2;
		return `<g transform="translate(${i * (LADO + ESPACIO)} 0)"><rect width="${LADO}" height="${LADO}" rx="60" fill="${FONDO[tema]}"/><g transform="translate(${margen} ${margen}) scale(${escala})">${cuerpo}</g></g>`;
	});
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${(ancho * 48) / LADO}" height="48" viewBox="0 0 ${ancho} ${LADO}" fill="none" role="img" aria-labelledby="agentes-titulo">
<title id="agentes-titulo">Agentes de codificación: ${LOGOS.map((l) => l.nombre).join(', ')}</title>
${baldosas.join('\n')}
</svg>
`;
}
