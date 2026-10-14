// Retrato en semitono: la foto de Mario convertida en puntos, dentro de una ventana pequeña.
// scripts/datos/retrato.txt guarda un nivel de brillo (0-9) por punto de una grilla hexagonal;
// se muestreó una sola vez de la foto, que no está en el repo.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { documento, r2 } from '../lib/svg.mjs';

const filas = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'datos', 'retrato.txt'), 'utf8')
	.split('\n')
	.filter((l) => /^\d+$/.test(l));

const COLUMNAS = filas[0].length;
const ANCHO_FOTO = 200;
const PASO = ANCHO_FOTO / COLUMNAS;
const DY = PASO * 0.866;
const ALTO_FOTO = Math.ceil(filas.length * DY);
const BARRA = 30;
const MARGEN = 14;
const W = ANCHO_FOTO + MARGEN * 2;
const H = BARRA + ALTO_FOTO + MARGEN * 2;

// La foto es la misma en los dos temas: una impresión rosa sobre fondo oscuro.
const PALETA = { fondo: '#151113', barra: '#1e181b', borde: '#3a2c31', punto: '#e8616e', brillo: '#ffb0b6', tenue: '#8a7378', rojo: '#fb4934', amarillo: '#fabd2f', verde: '#b8bb26' };

const css = `
.barrido{animation:barrido 7s ease-in-out infinite}
@keyframes barrido{0%{transform:translateY(-30px);opacity:0}8%{opacity:1}55%{transform:translateY(${ALTO_FOTO + 10}px);opacity:1}60%,100%{transform:translateY(${ALTO_FOTO + 10}px);opacity:0}}
`;

export function retrato() {
	return documento({
		id: 'retrato',
		ancho: W,
		alto: H,
		tema: PALETA,
		css,
		titulo: 'Retrato de Mario en semitono',
		descripcion: 'Mario Pereyra: pelo ondulado hasta los hombros, lentes de marco rectangular y camisa oscura. Retrato hecho de puntos rosas sobre fondo oscuro.',
		dibujar(api) {
			const color = (n) => `style="fill:var(--${n})"`;
			const x0 = MARGEN;
			const y0 = BARRA + MARGEN;
			const partes = [];
			api.def(`<clipPath id="${api.id('ventana')}"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="9"/></clipPath>`);
			api.def(`<clipPath id="${api.id('foto')}"><rect x="${x0}" y="${y0}" width="${ANCHO_FOTO}" height="${ALTO_FOTO}"/></clipPath>`);
			api.def(`<linearGradient id="${api.id('luz')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PALETA.brillo}" stop-opacity="0"/><stop offset=".5" stop-color="${PALETA.brillo}" stop-opacity=".14"/><stop offset="1" stop-color="${PALETA.brillo}" stop-opacity="0"/></linearGradient>`);

			partes.push(`<g clip-path="url(#${api.id('ventana')})"><rect width="${W}" height="${H}" ${color('fondo')}/><rect width="${W}" height="${BARRA}" ${color('barra')}/></g>`);
			partes.push(`<path d="M0 ${BARRA + 0.5}H${W}" style="stroke:var(--borde)"/><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="10" fill="none" style="stroke:var(--borde)"/>`);
			['rojo', 'amarillo', 'verde'].forEach((n, i) => partes.push(`<circle cx="${16 + i * 15}" cy="${BARRA / 2}" r="4.5" ${color(n)}/>`));
			partes.push(api.texto('mario.png', { x: W - 14, y: BARRA / 2 + 4, peso: 'mono', tam: 11, ancla: 'end', atributos: color('tenue') }));

			// Un trazado por tamaño de punto: «M x y h0» con punta redonda dibuja un punto.
			const porNivel = Array.from({ length: 10 }, () => []);
			filas.forEach((fila, f) => {
				for (let k = 0; k < fila.length; k++) {
					const nivel = Number(fila[k]);
					if (!nivel) continue;
					porNivel[nivel].push(`M${r2(x0 + (k + (f % 2 ? 0.5 : 0)) * PASO)} ${r2(y0 + f * DY + PASO / 2)}h0`);
				}
			});
			partes.push(`<g clip-path="url(#${api.id('foto')})" fill="none" stroke-linecap="round">`);
			porNivel.forEach((puntos, nivel) => {
				if (!puntos.length) return;
				const diametro = r2(PASO * 0.9 * Math.sqrt(nivel / 9));
				partes.push(`<path d="${puntos.join('')}" stroke-width="${diametro}" style="stroke:var(--${nivel === 9 ? 'brillo' : 'punto'})"/>`);
			});
			partes.push(`<rect class="barrido" x="${x0}" y="${y0}" width="${ANCHO_FOTO}" height="14" fill="url(#${api.id('luz')})"/>`);
			partes.push('</g>');

			// Miras en las esquinas, como en la foto original.
			for (const [mx, my] of [[x0 + 2, y0 + 2], [x0 + ANCHO_FOTO - 18, y0 + 2]]) {
				partes.push(`<g fill="none" style="stroke:var(--punto)" stroke-width=".8" opacity=".75"><circle cx="${mx + 8}" cy="${my + 8}" r="3"/><path d="M${mx} ${my + 8}h16M${mx + 8} ${my}v16"/></g>`);
			}
			return partes.join('\n');
		},
	});
}
