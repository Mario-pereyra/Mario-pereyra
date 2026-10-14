// Banner: una ventana de vim con el árbol de archivos a la izquierda y mario.yml abierto.
// La última línea se escribe sola y el cursor parpadea; sin animación se lee completa.
import { documento, r2 } from '../lib/svg.mjs';

const W = 880;
const H = 392;
const BARRA = 34; // barra de título
const ESTADO = 28; // línea de estado de vim
const LATERAL = 220; // ancho del árbol de archivos
const TAM = 13;
const AVANCE = TAM * 0.6; // Geist Mono: 0,6 em por carácter
const INTERLINEA = 22;
const PRIMERA = BARRA + 30; // línea base de la primera fila

// Cada línea de mario.yml es una lista de [texto, color].
const k = (t) => [t, 'clave'];
const v = (t) => [t, 'cadena'];
const p = (t) => [t, 'signo'];
const c = (t) => [t, 'comentario'];
const x = (t) => [t, 'texto'];
const lista = (clave, items) => [k(clave), x(': '), p('['), ...items.flatMap((it, i) => (i ? [p(', '), v(it)] : [v(it)])), p(']')];

const ESCRIBE = 'aprendiendo ingeniería de harness';
const YML = [
	[c('# mario.yml')],
	[k('nombre'), x(': '), v('Mario Alberto Pereyra Justiniano')],
	[k('rol'), x(': '), v('desarrollador')],
	[k('base'), x(': '), v('Santa Cruz de la Sierra, Bolivia')],
	[],
	[k('trabajo'), x(':')],
	[x('  '), k('empresa'), x(': '), v('Resultar Soluciones SRL')],
	[x('  '), k('puesto'), x(': '), v('consultor TOTVS Protheus'), c('  # desde oct. 2025')],
	[k('estudio'), x(': '), v('Ingeniería de Sistemas, Universidad NUR'), c('  # 7.º semestre')],
	[],
	lista('me_apasiona', ['agentes de IA', 'MCP', 'APIs', 'lógica de negocio']),
	lista('rumbo', ['backend', 'forward deployed engineering']),
	[k('ahora'), x(': ')], // el valor se escribe solo
];

// Árbol de archivos: [sangría, tipo, nombre]. tipo: raiz | abierta | cerrada | rama | fin | archivo | actual
const ARBOL = [
	[0, 'raiz', '~/mario/'],
	[0, 'cerrada', '.agents/'],
	[0, 'abierta', 'proyectos/'],
	[1, 'rama', 'vintage/'],
	[1, 'rama', 'protheus-db-mcp/'],
	[1, 'rama', 'quiniela-2026/'],
	[1, 'fin', 'cine-reservas/'],
	[0, 'abierta', 'aprendiendo/'],
	[1, 'rama', 'contexto.md'],
	[1, 'rama', 'harness.md'],
	[1, 'fin', 'evals.md'],
	[0, 'archivo', 'README.md'],
	[0, 'actual', 'mario.yml'],
];

const L = ESCRIBE.length * AVANCE;
const css = `
.escribe{animation:escribe 9s steps(${ESCRIBE.length},end) infinite}
@keyframes escribe{0%,10%{transform:translateX(-${r2(L)}px)}48%,100%{transform:translateX(0)}}
.parpadea{animation:parpadea 1.1s steps(1,end) infinite}
@keyframes parpadea{0%{opacity:1}50%{opacity:0}}
`;

export function banner(tema, nombreTema) {
	return documento({
		id: `banner-${nombreTema}`,
		ancho: W,
		alto: H,
		tema,
		css,
		titulo: 'mario.yml abierto en vim',
		descripcion: `Mario Alberto Pereyra Justiniano, desarrollador en Santa Cruz de la Sierra, Bolivia. Consultor TOTVS Protheus en Resultar Soluciones SRL desde octubre de 2025 y estudiante de 7.º semestre de Ingeniería de Sistemas en la Universidad NUR. Le apasionan los agentes de IA, MCP, las APIs y la lógica de negocio; su rumbo es backend y forward deployed engineering. Ahora: ${ESCRIBE}.`,
		dibujar(api) {
			const color = (nombre) => `style="fill:var(--${nombre})"`;
			const mono = (texto, x0, y, nombre, peso = 'mono', tam = TAM) => api.texto(texto, { x: x0, y, peso, tam, atributos: color(nombre) });
			const partes = [];
			const R = 10;

			// Ventana, barra de título y línea de estado.
			api.def(`<clipPath id="${api.id('ventana')}"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R - 1}"/></clipPath>`);
			partes.push(`<g clip-path="url(#${api.id('ventana')})">`);
			partes.push(`<rect width="${W}" height="${H}" ${color('ventana')}/>`);
			partes.push(`<rect width="${W}" height="${BARRA}" ${color('barra')}/>`);
			partes.push(`<rect y="${BARRA}" width="${LATERAL}" height="${H - BARRA - ESTADO}" ${color('lateral')}/>`);
			partes.push(`<rect y="${H - ESTADO}" width="${W}" height="${ESTADO}" ${color('barra')}/>`);
			partes.push('</g>');
			partes.push(`<path d="M0 ${BARRA + 0.5}H${W}M${LATERAL + 0.5} ${BARRA}V${H - ESTADO}M0 ${H - ESTADO - 0.5}H${W}" fill="none" style="stroke:var(--borde)"/>`);
			partes.push(`<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${R}" fill="none" style="stroke:var(--borde)"/>`);
			['rojo', 'amarillo', 'verde'].forEach((n, i) => partes.push(`<circle cx="${20 + i * 18}" cy="${BARRA / 2}" r="5.5" ${color(n)}/>`));
			partes.push(api.texto('vim ~/mario/mario.yml', { x: W / 2, y: BARRA / 2 + 4, peso: 'mono', tam: 12, ancla: 'middle', atributos: color('comentario') }));

			// Árbol de archivos.
			ARBOL.forEach(([sangria, tipo, nombre], i) => {
				const y = PRIMERA + i * INTERLINEA;
				if (tipo === 'actual') partes.push(`<rect x="1" y="${y - 15}" width="${LATERAL - 1}" height="${INTERLINEA}" ${color('seleccion')}/>`);
				if (tipo === 'raiz') return partes.push(mono(nombre, 16, y, 'clave', 'monoMedium'));
				if (tipo === 'abierta') partes.push(`<path d="M16 ${y - 7.5}h8l-4 5z" ${color('tenue')}/>`);
				if (tipo === 'cerrada') partes.push(`<path d="M17.5 ${y - 9.5}l5 4-5 4z" ${color('tenue')}/>`);
				if (tipo === 'rama' || tipo === 'fin') {
					// Guía del árbol: tramo vertical hasta el hijo y una muesca hacia el nombre.
					const arriba = y - INTERLINEA - 5 + (ARBOL[i - 1][1] === 'abierta' ? 6 : 0);
					partes.push(`<path d="M20.5 ${arriba}V${y - 4.5}${tipo === 'rama' ? `M20.5 ${y - 4.5}V${y + 6}` : ''}M20.5 ${y - 4.5}H30" fill="none" style="stroke:var(--borde)"/>`);
					partes.push(mono(nombre, 38, y, nombre.endsWith('/') ? 'texto' : 'comentario'));
					return;
				}
				const esCarpeta = tipo === 'abierta' || tipo === 'cerrada';
				partes.push(mono(nombre, 30 + sangria * 18, y, esCarpeta ? 'carpeta' : tipo === 'actual' ? 'texto' : 'comentario', tipo === 'actual' ? 'monoMedium' : 'mono'));
			});

			// mario.yml con números de línea; la línea actual va resaltada.
			const xNumero = LATERAL + 34;
			const xCodigo = LATERAL + 48;
			const actual = YML.length - 1;
			const yActual = PRIMERA + actual * INTERLINEA;
			partes.push(`<rect x="${LATERAL + 1}" y="${yActual - 15}" width="${W - LATERAL - 2}" height="${INTERLINEA}" ${color('seleccion')}/>`);
			YML.forEach((tokens, i) => {
				const y = PRIMERA + i * INTERLINEA;
				partes.push(api.texto(String(i + 1), { x: xNumero, y, peso: 'mono', tam: TAM, ancla: 'end', atributos: color(i === actual ? 'amarillo' : 'tenue') }));
				let col = 0;
				for (const [texto, nombre] of tokens) {
					if (texto.trim()) partes.push(mono(texto, xCodigo + col * AVANCE, y, nombre));
					col += texto.length;
				}
			});

			// Las líneas después del final del archivo, como en vim.
			for (let y = PRIMERA + YML.length * INTERLINEA; y < H - ESTADO - 4; y += INTERLINEA) partes.push(mono('~', xCodigo - 30, y, 'borde'));

			// La línea actual: el valor, una tapa del color de la línea que se corre al escribir, y el cursor.
			const colValor = YML[actual].reduce((n, [t]) => n + t.length, 0);
			const xValor = xCodigo + colValor * AVANCE;
			partes.push(mono(ESCRIBE, xValor, yActual, 'cadena'));
			partes.push(`<rect class="escribe" x="${r2(xValor + L)}" y="${yActual - 15}" width="${r2(L + AVANCE * 2)}" height="${INTERLINEA}" ${color('seleccion')}/>`);
			partes.push(`<g class="escribe"><rect class="parpadea" x="${r2(xValor + L + 1)}" y="${yActual - 13}" width="${r2(AVANCE)}" height="17" ${color('cursor')}/></g>`);

			// Línea de estado.
			const yEstado = H - ESTADO / 2 + 4;
			const modo = 'NORMAL';
			const anchoModo = api.medir(modo, { peso: 'monoMedium', tam: 11.5 }) + 20;
			partes.push(`<path d="M0 ${H - ESTADO}H${anchoModo}V${H}H${R}A${R} ${R} 0 0 1 0 ${H - R}Z" ${color('modo')}/>`);
			partes.push(api.texto(modo, { x: 10, y: yEstado, peso: 'monoMedium', tam: 11.5, atributos: color('sobreModo') }));
			partes.push(mono('main', anchoModo + 14, yEstado, 'cadena', 'mono', 12));
			partes.push(mono('mario.yml', anchoModo + 60, yEstado, 'texto', 'mono', 12));
			const posicion = `${actual + 1}:${colValor + ESCRIBE.length + 1}`;
			partes.push(api.texto(`yaml   utf-8   ${posicion}`, { x: W - 16, y: yEstado, peso: 'mono', tam: 12, ancla: 'end', atributos: color('comentario') }));

			return partes.join('\n');
		},
	});
}
