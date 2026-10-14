// Banner: una ventana de vim partida en dos. A la izquierda, mario.png (el retrato en semitono);
// a la derecha, mario.yml. La última línea se escribe sola y el cursor parpadea; sin animación se lee completa.
import { documento, r2 } from '../lib/svg.mjs';
import { altoRetrato, semitono } from './retrato.mjs';

const W = 880;
const BARRA = 34; // barra de título
const ESTADO = 28; // línea de estado de vim
const LATERAL = 290; // panel del retrato
const FOTO = 250; // ancho del retrato
const CABECERA = 30; // rótulo del panel del retrato
const ALTO_FOTO = altoRetrato(FOTO);
const H = BARRA + CABECERA + ALTO_FOTO + 16 + ESTADO;
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
	[k('estudio'), x(': '), v('Ingeniería de Sistemas, NUR'), c('  # 7.º semestre')],
	[],
	lista('me_apasiona', ['agentes de IA', 'MCP', 'APIs', 'lógica de negocio']),
	lista('rumbo', ['backend', 'forward deployed engineering']),
	[k('ahora'), x(': ')], // el valor se escribe solo
];

const L = ESCRIBE.length * AVANCE;
const css = `
.escribe{animation:escribe 9s steps(${ESCRIBE.length},end) infinite}
@keyframes escribe{0%,10%{transform:translateX(-${r2(L)}px)}48%,100%{transform:translateX(0)}}
.parpadea{animation:parpadea 1.1s steps(1,end) infinite}
@keyframes parpadea{0%{opacity:1}50%{opacity:0}}
.barrido{animation:barrido 7s ease-in-out infinite}
@keyframes barrido{0%{transform:translateY(-20px);opacity:0}8%{opacity:1}55%{transform:translateY(${ALTO_FOTO}px);opacity:1}60%,100%{transform:translateY(${ALTO_FOTO}px);opacity:0}}
`;

export function banner(tema, nombreTema) {
	return documento({
		id: `banner-${nombreTema}`,
		ancho: W,
		alto: H,
		tema,
		css,
		titulo: 'Retrato de Mario y mario.yml abiertos en vim',
		descripcion: `A la izquierda, un retrato de Mario hecho de puntos rosas: pelo ondulado, lentes de marco rectangular y camisa oscura. A la derecha, mario.yml: Mario Alberto Pereyra Justiniano, desarrollador en Santa Cruz de la Sierra, Bolivia. Consultor TOTVS Protheus en Resultar Soluciones SRL desde octubre de 2025 y estudiante de 7.º semestre de Ingeniería de Sistemas en la Universidad NUR. Le apasionan los agentes de IA, MCP, las APIs y la lógica de negocio; su rumbo es backend y forward deployed engineering. Ahora: ${ESCRIBE}.`,
		dibujar(api) {
			const color = (nombre) => `style="fill:var(--${nombre})"`;
			const mono = (texto, x0, y, nombre, peso = 'mono', tam = TAM) => api.texto(texto, { x: x0, y, peso, tam, atributos: color(nombre) });
			const partes = [];
			const R = 10;

			// Ventana, barra de título, panel del retrato y línea de estado.
			api.def(`<clipPath id="${api.id('ventana')}"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${R - 1}"/></clipPath>`);
			partes.push(`<g clip-path="url(#${api.id('ventana')})">`);
			partes.push(`<rect width="${W}" height="${H}" ${color('ventana')}/>`);
			partes.push(`<rect width="${W}" height="${BARRA}" ${color('barra')}/>`);
			partes.push(`<rect y="${BARRA}" width="${LATERAL}" height="${H - BARRA - ESTADO}" ${color('foto')}/>`);
			partes.push(`<rect y="${H - ESTADO}" width="${W}" height="${ESTADO}" ${color('barra')}/>`);
			partes.push('</g>');
			partes.push(`<path d="M0 ${BARRA + 0.5}H${W}M${LATERAL + 0.5} ${BARRA}V${H - ESTADO}M0 ${H - ESTADO - 0.5}H${W}" fill="none" style="stroke:var(--borde)"/>`);
			partes.push(`<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${R}" fill="none" style="stroke:var(--borde)"/>`);
			['rojo', 'amarillo', 'verde'].forEach((n, i) => partes.push(`<circle cx="${20 + i * 18}" cy="${BARRA / 2}" r="5.5" ${color(n)}/>`));
			partes.push(api.texto('vim -O mario.png mario.yml', { x: W / 2, y: BARRA / 2 + 4, peso: 'mono', tam: 12, ancla: 'middle', atributos: color('comentario') }));

			// Panel del retrato: rótulo, puntos, barrido de escáner y miras en las esquinas.
			const xFoto = (LATERAL - FOTO) / 2;
			const yFoto = BARRA + CABECERA;
			partes.push(mono('mario.png', xFoto, BARRA + 20, 'fotoTenue', 'mono', 11));
			partes.push(api.texto(`${FOTO}×${ALTO_FOTO} · semitono`, { x: xFoto + FOTO, y: BARRA + 20, peso: 'mono', tam: 11, ancla: 'end', atributos: color('fotoTenue') }));
			api.def(`<clipPath id="${api.id('foto')}"><rect x="${xFoto}" y="${yFoto}" width="${FOTO}" height="${ALTO_FOTO}"/></clipPath>`);
			api.def(`<linearGradient id="${api.id('luz')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--brillo)" stop-opacity="0"/><stop offset=".5" style="stop-color:var(--brillo)" stop-opacity=".14"/><stop offset="1" style="stop-color:var(--brillo)" stop-opacity="0"/></linearGradient>`);
			partes.push(`<g clip-path="url(#${api.id('foto')})">${semitono({ x: xFoto, y: yFoto, ancho: FOTO })}<rect class="barrido" x="${xFoto}" y="${yFoto}" width="${FOTO}" height="16" fill="url(#${api.id('luz')})"/></g>`);
			for (const mx of [xFoto + 2, xFoto + FOTO - 18]) {
				partes.push(`<g fill="none" style="stroke:var(--punto)" stroke-width=".8" opacity=".75"><circle cx="${mx + 8}" cy="${yFoto + 10}" r="3"/><path d="M${mx} ${yFoto + 10}h16M${mx + 8} ${yFoto + 2}v16"/></g>`);
			}

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
