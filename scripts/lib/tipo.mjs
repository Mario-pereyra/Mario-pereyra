// Texto como trazados: cada glifo se define una sola vez en <defs> y se coloca con <use>.
// Así el SVG no depende de fuentes instaladas ni de que el visor permita fuentes embebidas.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const opentype = require('opentype.js');
// geist no exporta su package.json: la ruta se arma desde la raíz del repo.
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'node_modules', 'geist', 'dist', 'fonts');

const archivos = {
	regular: 'geist-sans/Geist-Regular.ttf',
	medium: 'geist-sans/Geist-Medium.ttf',
	semibold: 'geist-sans/Geist-SemiBold.ttf',
	mono: 'geist-mono/GeistMono-Regular.ttf',
	monoMedium: 'geist-mono/GeistMono-Medium.ttf',
};

const fuentes = Object.fromEntries(Object.entries(archivos).map(([peso, archivo]) => [peso, opentype.loadSync(join(raiz, archivo))]));

// Los glifos se guardan a 100 unidades por em, con la línea base en y = 0.
const REF = 100;
const redondear = (n) => Math.round(n * 100) / 100;

/** Una tipografía por SVG: acumula los glifos usados y los emite en <defs>. */
export function crearTipografia(prefijo) {
	const glifos = new Map();

	function idDe(peso, glifo) {
		const id = `${prefijo}${peso[0]}${peso.length}${glifo.index}`;
		if (!glifos.has(id)) {
			const d = glifo.getPath(0, 0, REF).toPathData(2);
			glifos.set(id, d);
		}
		return id;
	}

	/** Mide el ancho de un texto en px. */
	function medir(texto, { peso = 'regular', tam = 16, tracking = 0 } = {}) {
		const fuente = fuentes[peso];
		const lista = fuente.stringToGlyphs(texto);
		let x = 0;
		for (let i = 0; i < lista.length; i++) {
			x += lista[i].advanceWidth;
			if (i < lista.length - 1) x += fuente.getKerningValue(lista[i], lista[i + 1]);
		}
		const escala = tam / fuente.unitsPerEm;
		return x * escala + tracking * tam * Math.max(0, lista.length - 1);
	}

	/**
	 * Un texto en (x, y) con y en la línea base. `ancla`: start | middle | end.
	 * `clase` y `atributos` van en el <g>, así el color se controla con CSS (fill heredado).
	 */
	function texto(contenido, { x = 0, y = 0, peso = 'regular', tam = 16, tracking = 0, ancla = 'start', clase = '', atributos = '' } = {}) {
		const fuente = fuentes[peso];
		const lista = fuente.stringToGlyphs(contenido);
		const escala = tam / REF;
		const unidad = REF / fuente.unitsPerEm;
		const ancho = medir(contenido, { peso, tam, tracking });
		const inicio = ancla === 'middle' ? x - ancho / 2 : ancla === 'end' ? x - ancho : x;
		let cursor = 0;
		const usos = [];
		for (let i = 0; i < lista.length; i++) {
			const g = lista[i];
			if (g.path && g.path.commands.length) usos.push(`<use href="#${idDe(peso, g)}" x="${redondear(cursor)}"/>`);
			cursor += g.advanceWidth * unidad;
			if (i < lista.length - 1) cursor += fuente.getKerningValue(g, lista[i + 1]) * unidad;
			cursor += (tracking * tam) / escala;
		}
		const cls = clase ? ` class="${clase}"` : '';
		return `<g${cls}${atributos ? ` ${atributos}` : ''} transform="translate(${redondear(inicio)} ${redondear(y)}) scale(${redondear(escala * 1000) / 1000})">${usos.join('')}</g>`;
	}

	/** Parte un texto en líneas que caben en `ancho`. */
	function partir(contenido, ancho, opciones) {
		const palabras = contenido.split(/\s+/);
		const lineas = [];
		let actual = '';
		for (const palabra of palabras) {
			const prueba = actual ? `${actual} ${palabra}` : palabra;
			if (actual && medir(prueba, opciones) > ancho) {
				lineas.push(actual);
				actual = palabra;
			} else actual = prueba;
		}
		if (actual) lineas.push(actual);
		return lineas;
	}

	function defs() {
		return [...glifos].map(([id, d]) => `<path id="${id}" d="${d}"/>`).join('');
	}

	return { texto, medir, partir, defs };
}

/** Métricas útiles para alinear: altura de mayúsculas y de x en px. */
export function alturaMayusculas(tam, peso = 'regular') {
	const f = fuentes[peso];
	return (f.tables.os2.sCapHeight / f.unitsPerEm) * tam;
}
