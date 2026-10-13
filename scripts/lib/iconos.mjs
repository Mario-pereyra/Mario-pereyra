// Íconos de línea de los tres pilares, centrados en (cx, cy), de unos 16 px.
// 0: software empresarial (documento), 1: desarrollo (código), 2: IA (destello).
export function icono(tipo, cx, cy, color) {
	const s = `style="stroke:${color}" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
	if (tipo === 'documento') {
		return `<path ${s} d="M${cx - 6} ${cy - 8}h8l4 4v12h-12z M${cx + 2} ${cy - 8}v4h4 M${cx - 3} ${cy}h6 M${cx - 3} ${cy + 3.5}h4"/>`;
	}
	if (tipo === 'codigo') {
		return `<path ${s} d="M${cx - 3} ${cy - 6}l-6 6 6 6 M${cx + 3} ${cy - 6}l6 6-6 6"/>`;
	}
	return `<path ${s} d="M${cx} ${cy - 8}c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8z"/>`;
}

const POR_PILAR = ['codigo', 'documento', 'destello'];
const POR_FLUJO = ['documento', 'codigo', 'destello'];

/** Ícono del pilar i (orden de PILARES: desarrollo, software empresarial, IA). */
export const iconoPilar = (i, cx, cy, color) => icono(POR_PILAR[i], cx, cy, color);
/** Ícono del nodo i del flujo de la portada (proceso, código, agentes). */
export const iconoFlujo = (i, cx, cy, color) => icono(POR_FLUJO[i], cx, cy, color);
