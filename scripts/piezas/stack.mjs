// Matriz del stack: áreas en filas y niveles en columnas. Los niveles son los de la autoevaluación.
import { documento, tarjeta, halo, rotulo, r2 } from '../lib/svg.mjs';
import { STACK, NIVELES } from '../datos.mjs';

const ANCHO = 880;
const X_AREA = 24;
const X_NIVELES = 220;
const COL_W = (ANCHO - 24 - X_NIVELES) / 3;
const CABECERA = 60;
const FICHA_H = 24;
const FICHA_GAP = 6;
const PAD = 14;

// Estilo de las fichas según el nivel: más contraste cuanto más dominio.
const ESTILOS = [
	{ fondo: 'var(--acento)', fondoOpacidad: 0.12, borde: 'var(--acento)', bordeOpacidad: 0.5, clase: 't-texto', peso: 'medium' },
	{ fondo: 'var(--tarjeta2)', fondoOpacidad: 1, borde: 'var(--bordeFuerte)', bordeOpacidad: 1, clase: 't-texto', peso: 'medium' },
	{ fondo: 'var(--tarjeta)', fondoOpacidad: 1, borde: 'var(--borde)', bordeOpacidad: 1, clase: 't-suave', peso: 'regular' },
];

export function stack(tema) {
	return documento({
		id: 'stack',
		ancho: ANCHO,
		alto: 0,
		tema,
		titulo: 'Stack técnico por nivel',
		descripcion: STACK.map((fila) => `${fila.area}: ${NIVELES.map((n, i) => `${n.nombre.toLowerCase()}, ${fila.niveles[i].length ? fila.niveles[i].join(', ') : 'ninguno'}`).join('; ')}.`).join(' '),
		dibujar: (api) => dibujar(api),
	});
}

function dibujar(api) {
	const { t } = api;
	const cuerpo = [];

	// Cabecera: título y las tres columnas de nivel con su indicador de barras.
	cuerpo.push(rotulo(api, 'Stack', { x: X_AREA, y: 36, marca: 'var(--acento)', color: 'var(--texto)' }));
	NIVELES.forEach((n, i) => {
		const x = X_NIVELES + i * COL_W;
		for (let b = 0; b < 3; b++) {
			const lleno = b < n.barras;
			cuerpo.push(`<rect x="${r2(x + b * 5)}" y="${27 + (2 - b) * 3}" width="3" height="${4 + b * 3}" rx="1" style="fill:${lleno ? 'var(--acento)' : 'var(--bordeFuerte)'}"/>`);
		}
		cuerpo.push(api.texto(n.nombre.toUpperCase(), { x: x + 22, y: 36, peso: 'monoMedium', tam: 11.5, tracking: 0.08, clase: i === 0 ? 't-texto' : 't-suave' }));
	});
	cuerpo.push(`<path class="linea" d="M1 ${CABECERA - 0.5}H${ANCHO - 1}"/>`);

	// Filas: una por área. La altura depende de cuántas líneas de fichas ocupa la columna más llena.
	let y = CABECERA;
	STACK.forEach((fila, f) => {
		const columnas = fila.niveles.map((items) => colocar(api, items));
		const lineas = Math.max(1, ...columnas.map((c) => c.lineas));
		const alto = PAD * 2 + lineas * (FICHA_H + FICHA_GAP) - FICHA_GAP;
		const base = y + PAD + FICHA_H / 2 + 4;
		const marca = fila.color ? `var(--${fila.color})` : 'var(--bordeFuerte)';
		cuerpo.push(rotulo(api, fila.area, { x: X_AREA, y: base, marca, color: 'var(--suave)' }));
		columnas.forEach((col, i) => {
			const x0 = X_NIVELES + i * COL_W;
			if (!col.items.length) {
				cuerpo.push(`<path class="linea-fuerte" d="M${r2(x0)} ${r2(base - 4)}h10"/>`);
				return;
			}
			const e = ESTILOS[i];
			for (const it of col.items) {
				const fx = x0 + it.x;
				const fy = y + PAD + it.linea * (FICHA_H + FICHA_GAP);
				cuerpo.push(`<rect x="${r2(fx + 0.5)}" y="${r2(fy + 0.5)}" width="${r2(it.ancho - 1)}" height="${FICHA_H - 1}" rx="7" style="fill:${e.fondo};stroke:${e.borde}" fill-opacity="${e.fondoOpacidad}" stroke-opacity="${e.bordeOpacidad}"/>`);
				cuerpo.push(api.texto(it.texto, { x: fx + 10, y: fy + FICHA_H / 2 + 4.4, peso: e.peso, tam: 12.5, clase: e.clase }));
			}
		});
		y += alto;
		if (f < STACK.length - 1) cuerpo.push(`<path class="linea" d="M${X_AREA} ${r2(y) - 0.5}H${ANCHO - 24}"/>`);
	});

	const altoTotal = y + 6;
	const caja = { x: 0, y: 0, w: ANCHO, h: altoTotal, r: 16 };
	api.alto = altoTotal;
	return [
		tarjeta(api, caja),
		halo(api, { ...caja, cx: X_NIVELES + 40, cy: 0, rx: 320, ry: 150, color: t.acento, opacidad: t.halo * 0.5 }),
		...cuerpo,
	].join('\n');
}

/** Reparte las fichas de una celda en líneas dentro del ancho de la columna. */
function colocar(api, items) {
	const max = COL_W - 14;
	let x = 0;
	let linea = 0;
	const colocadas = items.map((texto) => {
		const ancho = api.medir(texto, { peso: 'medium', tam: 12.5 }) + 20;
		if (x > 0 && x + ancho > max) {
			x = 0;
			linea++;
		}
		const it = { texto, ancho, x, linea };
		x += ancho + FICHA_GAP;
		return it;
	});
	return { items: colocadas, lineas: items.length ? linea + 1 : 1 };
}
