// Botones de enlace: portafolio, CV, LinkedIn y correo. Un SVG por botón, para enlazar cada uno.
import { documento, r2 } from '../lib/svg.mjs';

const ALTO = 40;

const BOTONES = [
	{ id: 'portafolio', texto: 'Portafolio', icono: 'globo', principal: true, titulo: 'Portafolio: mario-pereyra.github.io' },
	{ id: 'cv', texto: 'Descargar CV', icono: 'descarga', titulo: 'Descargar CV en PDF' },
	{ id: 'linkedin', texto: 'LinkedIn', icono: 'in', titulo: 'Perfil de LinkedIn' },
	{ id: 'correo', texto: 'Correo', icono: 'sobre', titulo: 'Escribir un correo' },
];

function icono(api, tipo, x, cy, color) {
	const s = `style="stroke:${color}" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
	const c = x + 8;
	if (tipo === 'globo') {
		return `<g ${s}><circle cx="${c}" cy="${cy}" r="7"/><ellipse cx="${c}" cy="${cy}" rx="3" ry="7"/><path d="M${c - 7} ${cy}h14"/></g>`;
	}
	if (tipo === 'descarga') {
		return `<g ${s}><path d="M${c} ${cy - 7}v9m-3.6-3.6 3.6 3.6 3.6-3.6"/><path d="M${c - 6.5} ${cy + 3.5}v2.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-2.5"/></g>`;
	}
	if (tipo === 'maletin') {
		return `<g ${s}><rect x="${c - 7.5}" y="${cy - 4.5}" width="15" height="11" rx="2"/><path d="M${c - 3} ${cy - 4.5}v-1.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v1.5M${c - 7.5} ${cy + 0.5}h15"/></g>`;
	}
	if (tipo === 'cuadricula') {
		return `<g ${s}><rect x="${c - 7}" y="${cy - 7}" width="6" height="6" rx="1.4"/><rect x="${c + 1}" y="${cy - 7}" width="6" height="6" rx="1.4"/><rect x="${c - 7}" y="${cy + 1}" width="6" height="6" rx="1.4"/><rect x="${c + 1}" y="${cy + 1}" width="6" height="6" rx="1.4"/></g>`;
	}
	if (tipo === 'sobre') {
		return `<g ${s}><rect x="${c - 7.5}" y="${cy - 5.5}" width="15" height="11" rx="2"/><path d="m${c - 6.5} ${cy - 4} ${6.5} ${5} ${6.5}-${5}"/></g>`;
	}
	// «in» dentro de un cuadrado redondeado.
	return `<g><rect x="${c - 7.5}" y="${cy - 7.5}" width="15" height="15" rx="3.2" style="stroke:${color}" fill="none" stroke-width="1.5"/>${api.texto('in', { x: c, y: cy + 3.7, peso: 'semibold', tam: 10.5, ancla: 'middle', atributos: `style="fill:${color}"` })}</g>`;
}

export function botones(tema) {
	const salida = {};
	for (const b of BOTONES) {
		salida[b.id] = documento({
			id: `boton-${b.id}`,
			ancho: 0,
			alto: ALTO,
			tema,
			titulo: b.titulo,
			descripcion: b.titulo,
			ajustarAncho: (api) => api.medir(b.texto, { peso: 'medium', tam: 14 }) + 16 + 10 + 18 * 2,
			dibujar: (api) => {
				const w = api.ancho;
				const fondo = b.principal ? 'var(--acento)' : 'var(--tarjeta)';
				const borde = b.principal ? 'var(--acento)' : 'var(--bordeFuerte)';
				const tinta = b.principal ? 'var(--sobreAcento)' : 'var(--texto)';
				return [
					`<rect x=".5" y=".5" width="${r2(w - 1)}" height="${ALTO - 1}" rx="10" style="fill:${fondo};stroke:${borde}"/>`,
					icono(api, b.icono, 18, ALTO / 2, tinta),
					api.texto(b.texto, { x: 18 + 16 + 10, y: ALTO / 2 + 5, peso: 'medium', tam: 14, atributos: `style="fill:${tinta}"` }),
				].join('');
			},
		});
	}
	return salida;
}

// Etiquetas de los <summary> del README: el ícono, el título, de qué trata y una flecha que invita a abrir.
const DESPLEGABLES = [
	{ id: 'experiencia', texto: 'Experiencia y formación', detalle: 'Resultar · Universidad NUR · idiomas', icono: 'maletin' },
	{ id: 'proyectos', texto: 'Más proyectos', detalle: 'Flowy ERP · Impulsame · AstroMarket · CLI de SQL', icono: 'cuadricula' },
];

export function desplegables(tema) {
	const salida = {};
	for (const d of DESPLEGABLES) {
		const anchoTexto = (api) => api.medir(d.texto, { peso: 'medium', tam: 14 });
		const anchoDetalle = (api) => api.medir(d.detalle, { peso: 'mono', tam: 11.5 });
		salida[d.id] = documento({
			id: `desplegable-${d.id}`,
			ancho: 0,
			alto: ALTO,
			tema,
			titulo: `${d.texto}: ${d.detalle}`,
			descripcion: `${d.texto} (${d.detalle}). Clic para desplegar.`,
			ajustarAncho: (api) => 18 + 16 + 10 + anchoTexto(api) + 14 + anchoDetalle(api) + 16 + 14 + 16,
			dibujar: (api) => {
				const w = api.ancho;
				const xTexto = 18 + 16 + 10;
				const xDetalle = xTexto + anchoTexto(api) + 14;
				const xFlecha = w - 16 - 7;
				return [
					`<rect x=".5" y=".5" width="${r2(w - 1)}" height="${ALTO - 1}" rx="10" style="fill:var(--tarjeta);stroke:var(--bordeFuerte)"/>`,
					icono(api, d.icono, 18, ALTO / 2, 'var(--acento)'),
					api.texto(d.texto, { x: xTexto, y: ALTO / 2 + 5, peso: 'medium', tam: 14, clase: 't-texto' }),
					api.texto(d.detalle, { x: xDetalle, y: ALTO / 2 + 4.2, peso: 'mono', tam: 11.5, clase: 't-tenue' }),
					`<path d="M${r2(xFlecha - 4)} ${ALTO / 2 - 2}l4 4 4-4" style="stroke:var(--suave)" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
				].join('');
			},
		});
	}
	return salida;
}
