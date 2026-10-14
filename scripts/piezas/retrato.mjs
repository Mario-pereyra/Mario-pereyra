// Retrato en semitono: la foto de Mario convertida en puntos.
// scripts/datos/retrato.txt guarda un nivel de brillo (0-9) por punto de una grilla hexagonal;
// se muestreó una sola vez de la foto, que no está en el repo.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { r2 } from '../lib/svg.mjs';

const filas = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'datos', 'retrato.txt'), 'utf8')
	.split('\n')
	.filter((l) => /^\d+$/.test(l));

const COLUMNAS = filas[0].length;

/** Alto que ocupa el retrato para un ancho dado. */
export const altoRetrato = (ancho) => Math.ceil(filas.length * (ancho / COLUMNAS) * 0.866);

/**
 * Dibuja el retrato con su esquina superior izquierda en (x, y). Los colores son variables CSS:
 * --punto para los puntos y --brillo para los más claros. Un trazado por tamaño de punto:
 * «M x y h0» con punta redonda dibuja un punto.
 */
export function semitono({ x, y, ancho }) {
	const paso = ancho / COLUMNAS;
	const dy = paso * 0.866;
	const porNivel = Array.from({ length: 10 }, () => []);
	filas.forEach((fila, f) => {
		for (let k = 0; k < fila.length; k++) {
			const nivel = Number(fila[k]);
			if (nivel) porNivel[nivel].push(`M${r2(x + (k + (f % 2 ? 0.5 : 0)) * paso)} ${r2(y + f * dy + paso / 2)}h0`);
		}
	});
	return porNivel
		.map((puntos, nivel) => {
			if (!puntos.length) return '';
			const diametro = r2(paso * 0.9 * Math.sqrt(nivel / 9));
			return `<path d="${puntos.join('')}" fill="none" stroke-linecap="round" stroke-width="${diametro}" style="stroke:var(--${nivel === 9 ? 'brillo' : 'punto'})"/>`;
		})
		.join('');
}
