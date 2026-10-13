// Piezas comunes de los SVG: documento, tarjeta, rejilla, halo y etiquetas.
import { crearTipografia } from './tipo.mjs';
import { variables } from './tema.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const r2 = (n) => Math.round(n * 100) / 100;

// Estilos base de todos los SVG. Las animaciones se apagan con «reducir movimiento».
const CSS_BASE = `
.t-texto{fill:var(--texto)}.t-suave{fill:var(--suave)}.t-tenue{fill:var(--tenue)}
.t-acento{fill:var(--acento)}.t-erp{fill:var(--erp)}.t-ia{fill:var(--ia)}
.tarjeta{fill:var(--tarjeta);stroke:var(--borde);stroke-width:1}
.tarjeta2{fill:var(--tarjeta2);stroke:var(--borde);stroke-width:1}
.linea{fill:none;stroke:var(--borde);stroke-width:1}
.linea-fuerte{fill:none;stroke:var(--bordeFuerte);stroke-width:1}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

/**
 * Crea un lienzo SVG. `dibujar(api)` devuelve el cuerpo; `api` trae la tipografía y helpers
 * ligados al tema. Devuelve el documento SVG completo como texto.
 */
export function documento({ id, ancho, alto, tema, titulo, descripcion, css = '', dibujar, ajustarAncho }) {
	const tipo = crearTipografia(`${id}-`);
	const defsExtra = [];
	const api = {
		t: tema,
		ancho,
		alto,
		...tipo,
		def: (markup) => defsExtra.push(markup),
		id: (nombre) => `${id}-${nombre}`,
	};
	// Algunas piezas (los botones) miden su texto para decidir el ancho.
	if (ajustarAncho) ancho = api.ancho = Math.ceil(ajustarAncho(api));
	const cuerpo = dibujar(api);
	alto = api.alto;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-labelledby="${id}-titulo ${id}-desc">
<title id="${id}-titulo">${esc(titulo)}</title>
<desc id="${id}-desc">${esc(descripcion)}</desc>
<style>svg{${variables(tema)}}${CSS_BASE}${css}</style>
<defs>${tipo.defs()}${defsExtra.join('')}</defs>
${cuerpo}
</svg>
`;
}

/** Tarjeta con borde de 1 px, brillo superior (tema oscuro) y relleno opcional. */
export function tarjeta(api, { x, y, w, h, r = 14, clase = 'tarjeta', brillo = true }) {
	const { t } = api;
	const partes = [`<rect class="${clase}" x="${r2(x + 0.5)}" y="${r2(y + 0.5)}" width="${r2(w - 1)}" height="${r2(h - 1)}" rx="${r}"/>`];
	if (brillo && t.brillo !== 'rgba(255,255,255,0)') {
		const gid = api.id(`brillo-${Math.round(x)}-${Math.round(y)}`);
		api.def(`<linearGradient id="${gid}" x1="${x}" x2="${x + w}" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`);
		partes.push(`<path d="M${r2(x + r)} ${r2(y + 0.5)}H${r2(x + w - r)}" stroke="url(#${gid})" stroke-width="1" fill="none"/>`);
	}
	return partes.join('');
}

/** Rejilla de líneas que se desvanece hacia los bordes, recortada a un rectángulo redondeado. */
export function rejilla(api, { x, y, w, h, r = 14, paso = 28, cx = 0.75, cy = 0.2, radio = 0.75 }) {
	const pid = api.id('rejilla');
	const mid = api.id('mascara-rejilla');
	const gid = api.id('grad-rejilla');
	const cid = api.id('recorte-rejilla');
	api.def(`<pattern id="${pid}" width="${paso}" height="${paso}" patternUnits="userSpaceOnUse" x="${x}" y="${y}"><path d="M${paso} 0V${paso}M0 ${paso}H${paso}" fill="none" style="stroke:var(--rejilla)" stroke-width="1"/></pattern>`);
	api.def(`<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${radio}"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`);
	api.def(`<mask id="${mid}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${gid})"/></mask>`);
	api.def(`<clipPath id="${cid}"><rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${r - 1}"/></clipPath>`);
	return `<g clip-path="url(#${cid})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${pid})" mask="url(#${mid})"/></g>`;
}

/** Halo de color difuso (gradiente radial), recortado a la tarjeta. */
export function halo(api, { x, y, w, h, r = 14, cx, cy, rx, ry, color, opacidad, clase = '' }) {
	const gid = api.id(`halo-${Math.round(cx)}-${Math.round(cy)}`);
	const cid = api.id(`recorte-halo-${Math.round(cx)}-${Math.round(cy)}`);
	api.def(`<radialGradient id="${gid}"><stop offset="0" stop-color="${color}" stop-opacity="${opacidad}"/><stop offset=".55" stop-color="${color}" stop-opacity="${r2(opacidad * 0.35)}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
	api.def(`<clipPath id="${cid}"><rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${r - 1}"/></clipPath>`);
	return `<g clip-path="url(#${cid})"><ellipse class="${clase}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${gid})"/></g>`;
}

/** Etiqueta en mayúsculas, monoespaciada, con un cuadrito de color opcional. */
export function rotulo(api, texto, { x, y, color = 'var(--tenue)', marca = null, tam = 11.5 }) {
	const partes = [];
	let dx = 0;
	if (marca) {
		partes.push(`<rect x="${x}" y="${r2(y - tam * 0.72)}" width="${r2(tam * 0.62)}" height="${r2(tam * 0.62)}" rx="1.5" style="fill:${marca}"/>`);
		dx = tam * 0.62 + 8;
	}
	partes.push(api.texto(texto.toUpperCase(), { x: x + dx, y, peso: 'monoMedium', tam, tracking: 0.08, atributos: `style="fill:${color}"` }));
	return partes.join('');
}

/** Ficha (chip) con borde. Devuelve { svg, ancho }. */
export function ficha(api, texto, { x, y, alto = 26, peso = 'medium', tam = 13, color = 'var(--suave)', borde = 'var(--borde)', fondo = 'var(--tarjeta2)', puntoColor = null, padding = 11 }) {
	const anchoTexto = api.medir(texto, { peso, tam });
	const punto = puntoColor ? 14 : 0;
	const ancho = anchoTexto + padding * 2 + punto;
	const partes = [`<rect x="${r2(x + 0.5)}" y="${r2(y + 0.5)}" width="${r2(ancho - 1)}" height="${alto - 1}" rx="${(alto - 1) / 2}" style="fill:${fondo};stroke:${borde}"/>`];
	if (puntoColor) partes.push(`<circle cx="${r2(x + padding + 3)}" cy="${r2(y + alto / 2)}" r="3" style="fill:${puntoColor}"/>`);
	partes.push(api.texto(texto, { x: x + padding + punto, y: y + alto / 2 + tam * 0.35, peso, tam, atributos: `style="fill:${color}"` }));
	return { svg: partes.join(''), ancho };
}
