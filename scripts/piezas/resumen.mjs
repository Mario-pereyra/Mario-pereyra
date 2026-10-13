// Panel tipo bento: los tres pilares y la franja de cifras de Resultar.
import { documento, tarjeta, halo, rotulo, r2 } from '../lib/svg.mjs';
import { PILARES, CIFRAS, RESULTAR } from '../datos.mjs';
import { iconoPilar } from '../lib/iconos.mjs';

const ANCHO = 880;
const GAP = 12;

export function resumen(tema) {
	return documento({
		id: 'resumen',
		ancho: ANCHO,
		alto: 0,
		tema,
		titulo: 'Qué hago: desarrollo, software empresarial e IA aplicada',
		descripcion: [
			...PILARES.map((p) => `${p.n} ${p.titulo}: ${p.texto} Prueba: ${p.prueba}.`),
			`${RESULTAR.titulo} (${RESULTAR.periodo}): ${CIFRAS.map((c) => `${c.valor} ${c.texto.join(' ')}`).join('; ')}.`,
		].join(' '),
		dibujar: (api) => {
			const { t } = api;
			const out = [];

			// Fila 1: pilares.
			const pw = (ANCHO - GAP * 2) / 3;
			const ph = 214;
			PILARES.forEach((p, i) => {
				const x = i * (pw + GAP);
				const color = `var(--${p.color})`;
				const caja = { x, y: 0, w: pw, h: ph, r: 14 };
				out.push(tarjeta(api, caja));
				out.push(halo(api, { ...caja, cx: x + pw - 20, cy: 6, rx: 190, ry: 120, color: t[p.color], opacidad: t.halo * 0.7 }));
				out.push(`<rect x="${x + 20.5}" y="20.5" width="35" height="35" rx="10" style="fill:${color};stroke:${color}" fill-opacity=".1" stroke-opacity=".5"/>`);
				out.push(iconoPilar(i, x + 38, 38, color));
				out.push(api.texto(p.n, { x: x + pw - 20, y: 34, peso: 'mono', tam: 12, ancla: 'end', clase: 't-tenue' }));
				out.push(api.texto(p.titulo, { x: x + 20, y: 88, peso: 'semibold', tam: 19, tracking: -0.01, clase: 't-texto' }));
				api.partir(p.texto, pw - 40, { peso: 'regular', tam: 14.5 }).forEach((linea, j) => {
					out.push(api.texto(linea, { x: x + 20, y: 113 + j * 20, peso: 'regular', tam: 14.5, clase: 't-suave' }));
				});
				out.push(`<path class="linea" d="M${r2(x + 20)} 172.5H${r2(x + pw - 20)}"/>`);
				out.push(`<circle cx="${x + 23}" cy="192" r="3" style="fill:${color}"/>`);
				out.push(api.texto(p.prueba, { x: x + 33, y: 196, peso: 'mono', tam: 11.5, clase: 't-suave' }));
			});

			// Fila 2: cifras de Resultar.
			const y = ph + GAP;
			const ch = 150;
			const caja = { x: 0, y, w: ANCHO, h: ch, r: 14 };
			out.push(tarjeta(api, caja));
			out.push(halo(api, { ...caja, cx: 60, cy: y + ch, rx: 320, ry: 140, color: t.erp, opacidad: t.halo * 0.55 }));
			out.push(rotulo(api, RESULTAR.titulo, { x: 20, y: y + 32, marca: 'var(--erp)' }));
			out.push(api.texto(RESULTAR.periodo.toUpperCase(), { x: ANCHO - 20, y: y + 32, peso: 'monoMedium', tam: 11.5, tracking: 0.08, ancla: 'end', clase: 't-tenue' }));
			const cw = (ANCHO - 40) / CIFRAS.length;
			CIFRAS.forEach((c, i) => {
				const cx = 20 + i * cw;
				if (i > 0) out.push(`<path class="linea" d="M${r2(cx) + 0.5} ${y + 58}V${y + ch - 20}"/>`);
				const px = i === 0 ? cx : cx + 20;
				out.push(api.texto(c.valor, { x: px, y: y + 92, peso: 'semibold', tam: 36, tracking: -0.03, clase: 't-texto' }));
				c.texto.forEach((linea, j) => out.push(api.texto(linea, { x: px, y: y + 114 + j * 17, peso: 'regular', tam: 13, clase: 't-suave' })));
			});
			api.alto = y + ch;
			return out.join('\n');
		},
	});
}
