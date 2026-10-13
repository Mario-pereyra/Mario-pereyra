// Portada: nombre, lema y roles a la izquierda; a la derecha, el flujo proceso → código → agentes.
import { documento, tarjeta, rejilla, halo, rotulo, ficha, r2 } from '../lib/svg.mjs';
import { PERFIL, FLUJO } from '../datos.mjs';
import { iconoFlujo } from '../lib/iconos.mjs';

const ANCHO = 880;
const ALTO = 300;

const CSS = `
@keyframes respira{0%,100%{opacity:.55}50%{opacity:1}}
.respira{animation:respira 9s ease-in-out infinite}
.respira2{animation:respira 11s ease-in-out -4s infinite}
@keyframes fluye{to{stroke-dashoffset:-18}}
.conector{stroke-dasharray:3 6;animation:fluye 1.4s linear infinite}
@keyframes baja{0%{transform:translateY(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(var(--d));opacity:0}}
.pulso{animation:baja 2.8s cubic-bezier(.45,0,.55,1) infinite}

@keyframes cursor{0%,49%{opacity:1}50%,100%{opacity:0}}
.cursor{animation:cursor 1.1s steps(1) infinite}
`;

export function portada(tema) {
	return documento({
		id: 'portada',
		ancho: ANCHO,
		alto: ALTO,
		tema,
		titulo: 'Mario Alberto Pereyra Justiniano',
		descripcion: `${PERFIL.lema} ${PERFIL.roles.join(', ')}. ${PERFIL.lugar}. Flujo: proceso del cliente, código (AdvPL, SQL, TypeScript) y agentes de IA con MCP de solo lectura.`,
		css: CSS,
		dibujar: (api) => {
			const { t } = api;
			const caja = { x: 0, y: 0, w: ANCHO, h: ALTO, r: 18 };
			const out = [];
			out.push(tarjeta(api, caja));
			out.push(rejilla(api, { ...caja, paso: 26, cx: 0.78, cy: 0.35, radio: 0.62 }));
			out.push(halo(api, { ...caja, cx: 720, cy: 30, rx: 340, ry: 210, color: t.acento, opacidad: t.halo, clase: 'respira' }));
			out.push(halo(api, { ...caja, cx: 870, cy: 300, rx: 260, ry: 170, color: t.ia, opacidad: t.halo * 0.8, clase: 'respira2' }));

			// Columna izquierda. Todo el contenido es visible sin animación: solo se animan los adornos.
			const x = 44;
			const kicker = 'Desarrollador';
			out.push(rotulo(api, kicker, { x, y: 60, marca: 'var(--acento)', color: 'var(--acento)' }));
			const anchoKicker = api.medir(kicker.toUpperCase(), { peso: 'monoMedium', tam: 11.5, tracking: 0.08 }) + 11.5 * 0.62 + 8;
			out.push(rotulo(api, `·  ${PERFIL.lugar}`, { x: x + anchoKicker + 10, y: 60 }));
			out.push(api.texto(PERFIL.nombre[0], { x: x - 2, y: 118, peso: 'semibold', tam: 46, tracking: -0.025, clase: 't-texto' }));
			out.push(api.texto(PERFIL.nombre[1], { x: x - 2, y: 170, peso: 'semibold', tam: 46, tracking: -0.025, clase: 't-texto' }));
			const lemaAncho = api.medir(PERFIL.lema, { peso: 'regular', tam: 17 });
			out.push(api.texto(PERFIL.lema, { x, y: 208, peso: 'regular', tam: 17, clase: 't-suave' }));
			out.push(`<rect class="cursor" x="${r2(x + lemaAncho + 5)}" y="194" width="2" height="18" rx="1" style="fill:var(--acento)"/>`);

			let fx = x;
			PERFIL.chips.forEach((chip) => {
				const f = ficha(api, chip.texto, { x: fx, y: 230, puntoColor: chip.color ? `var(--${chip.color})` : null });
				out.push(f.svg);
				fx += f.ancho + 8;
			});

			// Columna derecha: flujo de tres nodos.
			const nx = 584;
			const nw = 256;
			const nh = 58;
			const gap = 22;
			const ny0 = (ALTO - (nh * 3 + gap * 2)) / 2;
			FLUJO.forEach((nodo, i) => {
				const ny = ny0 + i * (nh + gap);
				const color = `var(--${nodo.color})`;
				out.push(tarjeta(api, { x: nx, y: ny, w: nw, h: nh, r: 12, clase: 'tarjeta2', brillo: false }));
				out.push(`<rect x="${nx + 12.5}" y="${ny + 12.5}" width="33" height="33" rx="9" style="fill:${color};stroke:${color}" fill-opacity=".1" stroke-opacity=".55"/>`);
				out.push(iconoFlujo(i, nx + 29, ny + 29, color));
				out.push(api.texto(nodo.titulo, { x: nx + 58, y: ny + 26, peso: 'semibold', tam: 15, clase: 't-texto' }));
				out.push(api.texto(nodo.detalle, { x: nx + 58, y: ny + 44, peso: 'mono', tam: 11.5, clase: 't-suave' }));
				if (i < FLUJO.length - 1) {
					const y1 = ny + nh;
					const y2 = ny + nh + gap;
					const cx = nx + 29;
					out.push(`<path class="conector" d="M${cx} ${y1 + 2}V${y2 - 2}" style="stroke:var(--bordeFuerte)" stroke-width="1.4" fill="none"/>`);
					const siguiente = `var(--${FLUJO[i + 1].color})`;
					out.push(`<circle class="pulso" cx="${cx}" cy="${y1 + 2}" r="2.6" style="fill:${siguiente};--d:${y2 - y1 - 4}px;animation-delay:${i * 1.4}s"/>`);
				}
			});
			return out.join('\n');
		},
	});
}
