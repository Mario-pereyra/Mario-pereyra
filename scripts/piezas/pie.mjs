// Pie del README: cierra con el mismo flujo de la portada (proceso → código → agentes) y cuenta
// que los gráficos salen de un script.
import { documento, tarjeta, halo, r2 } from '../lib/svg.mjs';
import { PERFIL, FLUJO } from '../datos.mjs';

const ANCHO = 880;
const ALTO = 96;

const CSS = `
@keyframes recorre{0%{transform:translateX(0);opacity:0}8%{opacity:1}92%{opacity:1}100%{transform:translateX(var(--dx));opacity:0}}
.recorre{animation:recorre 4.2s cubic-bezier(.45,0,.55,1) infinite}
@keyframes enciende{0%,100%{opacity:.35}50%{opacity:1}}
.enciende{animation:enciende 4.2s ease-in-out infinite}
`;

export function pie(tema) {
	return documento({
		id: 'pie',
		ancho: ANCHO,
		alto: ALTO,
		tema,
		titulo: `${PERFIL.nombre.join(' ')} · ${PERFIL.lugar}`,
		descripcion: 'Pie del perfil. Los gráficos de este README son SVG generados con código en scripts/generar.mjs.',
		css: CSS,
		dibujar: (api) => {
			const { t } = api;
			const caja = { x: 0, y: 0, w: ANCHO, h: ALTO, r: 16 };
			const out = [tarjeta(api, caja), halo(api, { ...caja, cx: ANCHO / 2, cy: ALTO + 30, rx: 260, ry: 90, color: t.acento, opacidad: t.halo * 0.6 })];
			out.push(api.texto(PERFIL.nombre.join(' '), { x: 24, y: 43, peso: 'semibold', tam: 15, clase: 't-texto' }));
			out.push(api.texto(PERFIL.lugar, { x: 24, y: 64, peso: 'regular', tam: 13, clase: 't-suave' }));

			// Centro: los tres nodos del flujo como puntos, con un pulso que los recorre.
			const cx = ANCHO / 2;
			const xs = [cx - 44, cx, cx + 44];
			out.push(`<path class="linea-fuerte" d="M${xs[0]} 48H${xs[2]}"/>`);
			FLUJO.forEach((n, i) => {
				out.push(`<circle cx="${xs[i]}" cy="48" r="7.5" style="fill:var(--tarjeta);stroke:var(--${n.color})" stroke-opacity=".55"/>`);
				out.push(`<circle class="enciende" cx="${xs[i]}" cy="48" r="3.5" style="fill:var(--${n.color});animation-delay:${r2(i * 1.2)}s"/>`);
			});
			out.push(`<circle class="recorre" cx="${xs[0]}" cy="48" r="2" style="fill:var(--texto);--dx:${xs[2] - xs[0]}px"/>`);

			out.push(api.texto('SVG GENERADOS CON CÓDIGO', { x: ANCHO - 24, y: 43, peso: 'monoMedium', tam: 11, tracking: 0.08, ancla: 'end', clase: 't-tenue' }));
			out.push(api.texto('scripts/generar.mjs', { x: ANCHO - 24, y: 64, peso: 'mono', tam: 12.5, ancla: 'end', clase: 't-acento' }));
			return out.join('\n');
		},
	});
}
