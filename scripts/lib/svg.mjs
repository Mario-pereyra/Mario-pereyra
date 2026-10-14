// Documento SVG con la tipografía en trazados y las variables del tema.
import { crearTipografia } from './tipo.mjs';
import { variables } from './tema.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const r2 = (n) => Math.round(n * 100) / 100;

// Las animaciones se apagan con «reducir movimiento».
const CSS_BASE = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}';

/**
 * Crea un lienzo SVG. `dibujar(api)` devuelve el cuerpo; `api` trae la tipografía y helpers.
 * Devuelve el documento SVG completo como texto.
 */
export function documento({ id, ancho, alto, tema, titulo, descripcion, css = '', dibujar }) {
	const tipo = crearTipografia(`${id}-`);
	const defsExtra = [];
	const api = { t: tema, ancho, alto, ...tipo, def: (markup) => defsExtra.push(markup), id: (nombre) => `${id}-${nombre}` };
	const cuerpo = dibujar(api);
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-labelledby="${id}-titulo ${id}-desc">
<title id="${id}-titulo">${esc(titulo)}</title>
<desc id="${id}-desc">${esc(descripcion)}</desc>
<style>svg{${variables(tema)}}${CSS_BASE}${css}</style>
<defs>${tipo.defs()}${defsExtra.join('')}</defs>
${cuerpo}
</svg>
`;
}
