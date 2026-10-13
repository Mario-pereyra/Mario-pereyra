// Fig. 1: protheus-db-mcp como un banco de pruebas isométrico.
// Un carro lleva la tarjeta de la consulta por las cuatro capas de solo lectura y llega al
// archivador de la base del ERP: vuelve con filas, nunca con cambios.
// Dibujado con el kit isométrico de la skill «anatomy» (scripts/vendor/iso-kit.mjs, licencia MIT).
import * as k from '../vendor/iso-kit.mjs';
import { documento, tarjeta, r2 } from '../lib/svg.mjs';

const ANCHO = 880;
const ALTO_TARJETA = 476;
const AREA = { x: 20, y: 46, w: 840, h: 384 };

// ---------- Mundo (unidades de ~1 px; z hacia arriba) ----------
const PLACA = { x: -262, y: -62, w: 524, d: 124, r: 8 };
const PLACA_H = 12;
const PATA_H = 5;
const RIEL_DESDE = -238;
const RIEL_HASTA = 150;
const RIELES_Y = [-17, 12];
const CARRO = { x: -22, y: -21, w: 44, d: 42, r: 3 };
const CARRO_Z = 3;
const CARRO_TOPE = 9;
const FICHA = { x: -16, y: -13, w: 32, d: 26, r: 1.4 };
const FICHA_TOPE = CARRO_TOPE + 1.2;

const X_REPOSO = -206;
const PARADAS = [-140, -60, 20, 90, 126];

const PORTICO_X = -140;
const POSTES_Y = [-38, 36];
const PORTICO_Z = 54;

const PRENSA_X = -60;
const RELOJ_X = 20;
const LLAVE_X = 91;
const ARCHIVO = { x: 168, y: -46, w: 74, d: 78, r: 3 };
const ARCHIVO_H = 104;
const CAJON_ABIERTO = 18;

// ---------- Tiempo de la animación (14 s, en %) ----------
const DURACION = 14;
const TRAMOS = [
	// [desde %, hasta %, x destino]
	[6, 14, PARADAS[0]],
	[20, 28, PARADAS[1]],
	[34, 42, PARADAS[2]],
	[52, 60, PARADAS[3]],
	[66, 72, PARADAS[4]],
	[82, 96, X_REPOSO],
];

// Proyección ajustada al área de dibujo (la misma para el dibujo y para las animaciones).
function proyeccion() {
	const P0 = k.fitProjection(
		[
			...k.boxCorners(PLACA, -PLACA_H - PATA_H, 0),
			...k.boxCorners(ARCHIVO, 0, ARCHIVO_H + 3),
			[PRENSA_X, -51, 76],
			[PORTICO_X, POSTES_Y[0], PORTICO_Z + 9],
			[ARCHIVO.x + 10, ARCHIVO.y + ARCHIVO.d + CAJON_ABIERTO + 3, 70],
		],
		AREA.w,
		AREA.h,
		{ pad: 18, azimuth: 58, elevation: 30 },
	);
	return { ...P0, origin: [P0.origin[0] + AREA.x, P0.origin[1] + AREA.y] };
}

export function figura(tema, nombreTema) {
	const oscuro = nombreTema === 'oscuro';
	return documento({
		id: 'figura',
		ancho: ANCHO,
		alto: 0,
		tema,
		titulo: 'Fig. 1: protheus-db-mcp, cuatro capas de solo lectura',
		descripcion:
			'Banco de pruebas isométrico. Un carro lleva la tarjeta de una consulta SELECT por cuatro estaciones: un lector con peine (guardia léxica, con una bandeja de tarjetas rechazadas), una prensa trabada con un pasador (transacción de solo lectura), un reloj de filas con tope en 500 (límites) y una llave en un interruptor (cuenta con permiso SELECT). Llega al archivador de la base del ERP, que tiene un cajón abierto, y vuelve con filas impresas en la tarjeta.',
		css: cssDe(tema, oscuro),
		dibujar: (api) => dibujar(api),
	});
}

function cssDe(t, oscuro) {
	const fichas = oscuro
		? {
				paper: t.tarjeta, face: '#172028', top: '#18222a',
				s0: '#0d1216', s1: '#10161b', s2: '#131a20', s3: '#161e25',
				litTop: '#163a37', litShade: '#122c2a',
				hi: '#d3dbe2', mid: '#6b7784', lo: '#394550', faint: '#25303a', lit: t.acento,
				halo: '#000000', haloOp: '.8', dot: '#e6edf3',
			}
		: {
				paper: t.tarjeta, face: '#ffffff', top: '#ffffff',
				s0: '#dde2e6', s1: '#e6eaed', s2: '#eef1f3', s3: '#f5f7f8',
				litTop: '#e3f3f1', litShade: '#d3ebe8',
				hi: '#22272c', mid: '#88919a', lo: '#b5bcc3', faint: '#d6dbe0', lit: t.acento,
				halo: '#7d8590', haloOp: '.3', dot: '#3a3f45',
			};
	const vars = `--anatomy-paper:${fichas.paper};--anatomy-face:${fichas.face};--anatomy-top:${fichas.top};--anatomy-shade-0:${fichas.s0};--anatomy-shade-1:${fichas.s1};--anatomy-shade-2:${fichas.s2};--anatomy-shade-3:${fichas.s3};--anatomy-lit-top:${fichas.litTop};--anatomy-lit-shade:${fichas.litShade};--anatomy-hi:${fichas.hi};--anatomy-mid:${fichas.mid};--anatomy-lo:${fichas.lo};--anatomy-faint:${fichas.faint};--anatomy-lit:${fichas.lit};--anatomy-halo:${fichas.halo};--anatomy-halo-opacity:${fichas.haloOp};--anatomy-dot:${fichas.dot};--anatomy-weight:.75px;--anatomy-mono:ui-monospace,monospace`;

	// Recorrido del carro: traslaciones en pantalla calculadas con la misma proyección.
	const P = proyeccion();
	const paso = (x) => {
		const [dx, dy] = k.axisVector(P, [x - X_REPOSO, 0, 0]);
		return `transform:translate(${r2(dx)}px,${r2(dy)}px)`;
	};
	const cuadros = ['0%,6%{transform:translate(0,0)}'];
	for (const [, hasta, x] of TRAMOS) {
		const siguiente = TRAMOS.find(([desde]) => desde > hasta)?.[0] ?? 100;
		cuadros.push(`${hasta}%,${siguiente}%{${paso(x)}}`);
	}
	const fase = (nombre, pasos) => `@keyframes ${nombre}{${pasos}}`;
	const anim = `
.carro{animation:carro ${DURACION}s cubic-bezier(.45,0,.25,1) infinite}
${fase('carro', cuadros.join(''))}
.lampara{opacity:0;animation:lampara ${DURACION}s ease-in-out infinite}
${fase('lampara', '0%,13%{opacity:0}15%,20%{opacity:1}23%,100%{opacity:0}')}
.aguja{transform-box:fill-box;transform-origin:50% 50%;transform:rotate(-135deg);animation:aguja ${DURACION}s cubic-bezier(.3,.1,.2,1) infinite}
${fase('aguja', '0%,43%{transform:rotate(-135deg)}50%,84%{transform:rotate(0deg)}94%,100%{transform:rotate(-135deg)}')}
.piloto{opacity:0;animation:piloto ${DURACION}s ease-in-out infinite}
${fase('piloto', '0%,59%{opacity:0}61%,66%{opacity:1}70%,100%{opacity:0}')}
.cajon{opacity:0;animation:cajon ${DURACION}s ease-in-out infinite}
${fase('cajon', '0%,71%{opacity:0}73%,82%{opacity:1}86%,100%{opacity:0}')}
.filas{opacity:0;animation:filas ${DURACION}s ease-in-out infinite}
${fase('filas', '0%,75%{opacity:0}78%,95%{opacity:1}98%,100%{opacity:0}')}
.lectura{opacity:0;animation:${DURACION}s steps(1,end) infinite}
.l0{opacity:1;animation-name:l0}.l1{animation-name:l1}.l2{animation-name:l2}.l3{animation-name:l3}.l4{animation-name:l4}.l5{animation-name:l5}
${fase('l0', '0%{opacity:1}14%{opacity:0}96%{opacity:1}')}
${fase('l1', '0%{opacity:0}14%{opacity:1}28%{opacity:0}')}
${fase('l2', '0%{opacity:0}28%{opacity:1}42%{opacity:0}')}
${fase('l3', '0%{opacity:0}42%{opacity:1}60%{opacity:0}')}
${fase('l4', '0%{opacity:0}60%{opacity:1}72%{opacity:0}')}
${fase('l5', '0%{opacity:0}72%{opacity:1}96%{opacity:0}')}
`;
	return `svg{${vars}}${k.ISO_CSS}${anim}`;
}

function dibujar(api) {
	const out = [];
	const caja = { x: 0, y: 0, w: ANCHO, h: ALTO_TARJETA, r: 16 };
	out.push(tarjeta(api, caja));

	const P = proyeccion();
	const at = (p) => k.iso(p, P);
	const S = (paths, style) => k.solidSvg(paths, style);
	const L = (d, style) => k.lineSvg(d, style);
	const D = (points, style) => k.dotsSvg(points, style);
	const porProfundidad = (puntos) => [...puntos].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
	const halo = (plan, z, h, blur = 9) => `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"${blur !== 9 ? ` style="filter:blur(${blur}px)"` : ''}/>`;

	// ---------- Placa base, patas, regla y placa de identificación ----------
	out.push(halo(PLACA, -PLACA_H - PATA_H, PLACA_H));
	for (const [x, y] of porProfundidad(k.corners(PLACA, 22))) {
		out.push(S(k.cylinder(x, y, 7, -PLACA_H - PATA_H, 1.6, P, 28), { tone: 'lo' }));
		out.push(S(k.cylinder(x, y, 5.4, -PLACA_H - PATA_H + 1.6, PATA_H - 1.6, P, 28), { tone: 'mid' }));
	}
	out.push(S(k.slabOf(PLACA, -PLACA_H, PLACA_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLACA, -PLACA_H + 3, P, 8), { tone: 'faint' }) }));
	out.push(L(k.planOutline(k.insetPlan(PLACA, 5), 0, P), { tone: 'lo' }));
	const tornillos = k.corners(PLACA, 10);
	out.push(L(tornillos.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
	out.push(D(tornillos.map(([x, y]) => at([x, y, 0])), { size: 0.55 }));

	const regla = { x: RIEL_DESDE, y: 50, w: RIEL_HASTA - RIEL_DESDE, d: 7, r: 1 };
	out.push(S(k.slabOf(regla, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
	const marcas = k.topTicks(regla.x + 4, regla.x + regla.w - 4, 4, 5, regla.y + 0.8, 0.6, [2, 3.6], P);
	out.push(L(marcas.minor, { tone: 'lo' }), L(marcas.major, { tone: 'mid' }));
	out.push(D([at([regla.x + 2, regla.y + 3.5, 0.6]), at([regla.x + regla.w - 2, regla.y + 3.5, 0.6])], { size: 0.45 }));

	const placa = { x: -254, y: 28, w: 40, d: 15, r: 1.2 };
	out.push(S(k.slabOf(placa, 0, 0.8, P, 4), { tone: 'mid', crease: 'none' }));
	out.push(L(k.planOutline(k.insetPlan(placa, 1.6), 0.8, P, 4), { tone: 'faint' }));
	[[0, 24], [0, 16], [0, 20]].forEach(([, largo], i) => out.push(L(k.lineOnTop([placa.x + 6, placa.y + 4.5 + i * 3], [placa.x + 6 + largo, placa.y + 4.5 + i * 3], 0.8, P), { tone: 'lo', free: true })));
	out.push(D([at([placa.x + 3, placa.y + 7.5, 0.8]), at([placa.x + placa.w - 3, placa.y + 7.5, 0.8])], { size: 0.45 }));

	// ---------- Rieles y topes ----------
	for (const y of RIELES_Y) {
		out.push(S(k.slabOf({ x: RIEL_DESDE, y, w: RIEL_HASTA - RIEL_DESDE, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: 'mid' }));
		out.push(D([RIEL_DESDE + 6, -100, 0, 100, RIEL_HASTA - 6].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }));
	}
	for (const x of [RIEL_DESDE - 5, RIEL_HASTA]) {
		out.push(S(k.slabOf({ x, y: -23, w: 5, d: 46, r: 1.2 }, 0, 8, P, 3, 0.5), { tone: 'mid' }));
		out.push(D([at([x + 2.5, -18, 8]), at([x + 2.5, 18, 8])], { size: 0.45 }));
	}

	// ---------- Piezas de atrás (antes del carro) ----------
	// Pórtico, poste trasero.
	out.push(poste(PORTICO_X, POSTES_Y[0]));
	// Prensa: base y columna.
	out.push(S(k.slabOf({ x: PRENSA_X - 14, y: -56, w: 28, d: 22, r: 2 }, 0, 8, P, 4, 0.6), { tone: 'mid' }));
	out.push(D([at([PRENSA_X - 10, -52, 8]), at([PRENSA_X + 10, -52, 8]), at([PRENSA_X + 10, -38, 8])], { size: 0.45 }));
	out.push(S(k.slabOf({ x: PRENSA_X - 9, y: -52, w: 18, d: 14, r: 2 }, 8, 58, P, 4, 0.5), { tone: 'mid', inner: L(k.sideSeam({ x: PRENSA_X - 9, y: -52, w: 18, d: 14, r: 2 }, 30, P, 4), { tone: 'faint' }) }));
	// Reloj de filas: base, caja y esfera en la cara frontal.
	out.push(reloj());

	// ---------- Carro con la tarjeta (se mueve) ----------
	out.push(carro());

	// ---------- Piezas de adelante y de arriba (después del carro) ----------
	out.push(bandeja());
	out.push(poste(PORTICO_X, POSTES_Y[1]));
	out.push(portico());
	out.push(prensaArriba());
	out.push(llave());
	out.push(archivador());

	// ---------- Esquinas de la tarjeta y lectura animada ----------
	out.push(esquinas());
	out.push(leyenda());
	api.alto = ALTO_TARJETA + 16 + 58 + 44;
	return out.join('\n');

	// ======== Piezas ========

	function poste(x, y) {
		const p = [];
		p.push(S(k.cylinder(x, y, 6, 0, 3, P, 28), { tone: 'mid' }));
		p.push(S(k.cylinder(x, y, 3.6, 3, PORTICO_Z - 3, P, 24), { tone: 'mid', crease: 'none', inner: L([20, 38].map((z) => k.sideArc(x, y, 3.6, z, P, 14)).join(''), { tone: 'faint' }) }));
		return p.join('');
	}

	function portico() {
		const p = [];
		const travesano = { x: PORTICO_X - 7, y: POSTES_Y[0] - 5, w: 14, d: POSTES_Y[1] - POSTES_Y[0] + 10, r: 2 };
		// Cabezal lector colgado del travesaño, con su peine de agujas.
		const cabezal = { x: PORTICO_X - 9, y: -12, w: 18, d: 24, r: 2 };
		const agujasY = [-8, -4, 0, 4, 8];
		for (const y of agujasY) p.push(S(k.cylinder(PORTICO_X + 4, y, 0.8, 24, 6.5, P, 10), { tone: 'hi', crease: 'none' }));
		p.push(S(k.slabOf(cabezal, 30, PORTICO_Z - 30, P, 4, 0.5), { tone: 'mid', inner: L(k.sideSeam(cabezal, 36, P, 4), { tone: 'faint' }) }));
		p.push(D([at([cabezal.x + cabezal.w, -7, 46]), at([cabezal.x + cabezal.w, 7, 46])].map(([sx, sy]) => [sx, sy]), { size: 0.5 }));
		p.push(S(k.slabOf(travesano, PORTICO_Z, 6, P, 4, 0.6), { tone: 'mid' }));
		p.push(D(POSTES_Y.map((y) => at([PORTICO_X, y, PORTICO_Z + 6])), { size: 0.5 }));
		// Lámpara: se enciende cuando el carro pasa por el lector.
		const lamp = [PORTICO_X, 24];
		p.push(S(k.cylinder(lamp[0], lamp[1], 3.4, PORTICO_Z + 6, 1.4, P, 20), { tone: 'mid' }));
		p.push(S(k.cylinder(lamp[0], lamp[1], 2.6, PORTICO_Z + 7.4, 1.8, P, 20), { tone: 'hi' }));
		p.push(`<g class="anim lampara">${S(k.cylinder(lamp[0], lamp[1], 2.6, PORTICO_Z + 7.4, 1.8, P, 20), { tone: 'hi', lit: true })}</g>`);
		return p.join('');
	}

	function bandeja() {
		const b = { x: -204, y: 22, w: 42, d: 24, r: 2 };
		const p = [halo(b, 0, 0.1, 4)];
		p.push(S(k.slabOf(b, 0, 1.5, P, 4), { tone: 'lo' }));
		const pared = 1.4;
		const alto = 6;
		// Paredes en orden de profundidad: trasera, izquierda, contenido, derecha, delantera.
		p.push(S(k.slabOf({ x: b.x, y: b.y, w: b.w, d: pared, r: 0.6 }, 1.5, alto, P, 2), { tone: 'mid' }));
		p.push(S(k.slabOf({ x: b.x, y: b.y, w: pared, d: b.d, r: 0.6 }, 1.5, alto, P, 2), { tone: 'mid' }));
		const rechazada = { x: b.x + 6, y: b.y + 5, w: 28, d: 14, r: 1 };
		p.push(S(k.slabOf(rechazada, 1.5, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
		p.push(L(k.lineOnTop([rechazada.x + 10, rechazada.y + 3.5], [rechazada.x + 18, rechazada.y + 10.5], 2.3, P) + k.lineOnTop([rechazada.x + 18, rechazada.y + 3.5], [rechazada.x + 10, rechazada.y + 10.5], 2.3, P), { tone: 'mid', free: true }));
		p.push(S(k.slabOf({ x: b.x + b.w - pared, y: b.y, w: pared, d: b.d, r: 0.6 }, 1.5, alto, P, 2), { tone: 'mid' }));
		p.push(S(k.slabOf({ x: b.x, y: b.y + b.d - pared, w: b.w, d: pared, r: 0.6 }, 1.5, alto, P, 2), { tone: 'mid' }));
		return p.join('');
	}

	function prensaArriba() {
		const p = [];
		const brazo = { x: PRENSA_X - 9, y: -52, w: 18, d: 50, r: 2 };
		const eje = [PRENSA_X, -4];
		// Vástago y punzón (trabados arriba), camisa, pasador partido alrededor de la camisa.
		p.push(S(k.cylinder(eje[0], eje[1], 4.6, 26, 4, P, 24, 0.4), { tone: 'mid' }));
		p.push(S(k.cylinder(eje[0], eje[1], 2.4, 30, 22, P, 18), { tone: 'mid', crease: 'none' }));
		const pasador = (x0, x1) => S(k.slabOf({ x: x0, y: eje[1] - 1.6, w: x1 - x0, d: 3.2, r: 1.4 }, 57, 3.2, P, 3), { tone: 'hi', crease: 'none' });
		p.push(pasador(PRENSA_X - 12, PRENSA_X - 5));
		p.push(S(k.cylinder(eje[0], eje[1], 6.5, 52, 14, P, 32, 0.5), { tone: 'mid', inner: L(k.sideArc(eje[0], eje[1], 6.5, 56, P, 18) + k.sideArc(eje[0], eje[1], 6.5, 61.5, P, 18), { tone: 'faint' }) }));
		p.push(pasador(PRENSA_X + 5, PRENSA_X + 13));
		p.push(S(k.cylinder(PRENSA_X + 14.5, eje[1], 2.6, 55.6, 6, P, 18), { tone: 'hi' }));
		p.push(L(k.knurl(PRENSA_X + 14.5, eje[1], 2.6, 55.6, 61.6, 16, P), { tone: 'lo' }));
		p.push(S(k.slabOf(brazo, 66, 10, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(brazo, 70, P, 4), { tone: 'faint' }) }));
		p.push(D([at([PRENSA_X - 5, -46, 76]), at([PRENSA_X + 5, -46, 76]), at([PRENSA_X, -8, 76])], { size: 0.5 }));
		return p.join('');
	}

	function reloj() {
		const p = [];
		const base = { x: RELOJ_X - 16, y: -56, w: 32, d: 18, r: 2 };
		const cuerpo = { x: RELOJ_X - 14, y: -54, w: 28, d: 12, r: 2.5 };
		const tope = 50;
		p.push(S(k.slabOf(base, 0, 6, P, 4, 0.5), { tone: 'mid' }));
		p.push(D([at([base.x + 3, base.y + base.d - 3, 6]), at([base.x + base.w - 3, base.y + base.d - 3, 6])], { size: 0.45 }));
		p.push(S(k.slabOf(cuerpo, 6, tope - 6, P, 4, 0.6), { tone: 'mid' }));
		// Perilla del temporizador (30 s) arriba.
		const perilla = [RELOJ_X + 7, -48];
		p.push(S(k.cylinder(perilla[0], perilla[1], 3.6, tope, 4, P, 24), { tone: 'mid' }));
		p.push(L(k.knurl(perilla[0], perilla[1], 3.6, tope, tope + 4, 24, P), { tone: 'lo' }));
		p.push(L(k.lineOnTop([perilla[0], perilla[1]], [perilla[0] + 2.4, perilla[1] + 2.4], tope + 4, P), { tone: 'hi', free: 'end' }));
		// Esfera en la cara frontal (plano y = cuerpo.y + cuerpo.d), en coordenadas locales u (x) y v (hacia abajo).
		const cara = cuerpo.y + cuerpo.d;
		const m = k.sideMatrix([cuerpo.x, cara], tope, P, 'left');
		const c = [14, 15];
		const R = 10.5;
		const ang = (g) => ((g - 90) * Math.PI) / 180;
		const punto = (g, r) => [c[0] + r * Math.cos(ang(g)), c[1] + r * Math.sin(ang(g))];
		const marcas = [];
		for (let i = 0; i <= 20; i++) {
			const g = -135 + (270 * i) / 20;
			const mayor = i % 5 === 0;
			const [x1, y1] = punto(g, R - 0.8);
			const [x2, y2] = punto(g, R - (mayor ? 3.4 : 2));
			marcas.push(`<path class="iso-line" data-tone="${mayor ? 'mid' : 'lo'}" d="M${r2(x1)} ${r2(y1)}L${r2(x2)} ${r2(y2)}"/>`);
		}
		const arco = (g0, g1, r) => {
			const [x1, y1] = punto(g0, r);
			const [x2, y2] = punto(g1, r);
			return `M${r2(x1)} ${r2(y1)}A${r} ${r} 0 ${g1 - g0 > 180 ? 1 : 0} 1 ${r2(x2)} ${r2(y2)}`;
		};
		const [px, py] = punto(0, R - 4.6);
		// Ventana del contador de filas debajo de la esfera.
		const ventana = { u: 7, v: 29, w: 14, h: 5 };
		const separadores = [1, 2, 3].map((i) => `M${ventana.u + (ventana.w / 4) * i} ${ventana.v}V${ventana.v + ventana.h}`).join('');
		p.push(`<g transform="${m}">
<circle cx="${c[0]}" cy="${c[1]}" r="${R + 1.6}" class="iso-fill"/>
<circle cx="${c[0]}" cy="${c[1]}" r="${R + 1.6}" class="iso-line" data-tone="mid"/>
<circle cx="${c[0]}" cy="${c[1]}" r="${R}" style="fill:var(--anatomy-top)"/>
<circle cx="${c[0]}" cy="${c[1]}" r="${R}" class="iso-line" data-tone="lo"/>
${marcas.join('')}
<path class="iso-line" data-tone="faint" d="${arco(0, 135, R - 5.6)}" style="stroke-width:1.6"/>
<circle cx="${r2(px)}" cy="${r2(py)}" r="0.9" style="fill:var(--anatomy-hi)"/>
<rect x="${ventana.u}" y="${ventana.v}" width="${ventana.w}" height="${ventana.h}" rx="0.8" style="fill:var(--anatomy-shade-0)"/>
<path class="iso-line" data-tone="lo" d="M${ventana.u} ${ventana.v}h${ventana.w}v${ventana.h}h${-ventana.w}z${separadores}"/>
<g transform="translate(${c[0]} ${c[1]})"><g class="anim aguja">
<path d="M0 -${R - 1.6}V${R - 1.6}" style="stroke:none;fill:none"/>
<path class="iso-line" data-tone="hi" d="M0 3V-${R - 2.2}" style="stroke-width:1.1"/>
<circle r="1.3" style="fill:var(--anatomy-hi)"/>
</g></g>
</g>`);
		return p.join('');
	}

	function carro() {
		const p = [];
		const en = (plan) => ({ ...plan, x: plan.x + X_REPOSO });
		const c = en(CARRO);
		p.push(halo(k.insetPlan(c, 3), CARRO_Z, 0.1, 4));
		// Patines sobre los rieles.
		for (const y of RIELES_Y) for (const dx of [-16, 10]) p.push(S(k.slabOf({ x: X_REPOSO + dx, y: y - 1, w: 6, d: 7, r: 1 }, 2, 1.2, P, 2), { tone: 'mid', crease: 'none' }));
		p.push(S(k.slabOf(c, CARRO_Z, CARRO_TOPE - CARRO_Z, P, 5, 0.6), { tone: 'mid', inner: L(k.sideSeam(c, CARRO_Z + 2.4, P, 5), { tone: 'faint' }) }));
		p.push(D([-16, -6, 6, 16].map((x) => at([X_REPOSO + x, c.y + c.d - 2.4, CARRO_TOPE])), { size: 0.4, tone: 'lo' }));
		// Manija delantera.
		const manija = [X_REPOSO + 12, c.y + c.d + 3];
		p.push(S(k.slabOf({ x: manija[0] - 2, y: c.y + c.d - 1, w: 4, d: 4, r: 1 }, CARRO_Z + 1, 3, P, 2), { tone: 'mid', crease: 'none' }));
		p.push(S(k.cylinder(manija[0], manija[1] + 1, 2.8, CARRO_Z, 5, P, 20), { tone: 'mid' }));
		p.push(L(k.knurl(manija[0], manija[1] + 1, 2.8, CARRO_Z, CARRO_Z + 5, 18, P), { tone: 'lo' }));
		// Tarjeta de la consulta, con «SELECT» grabado; vuelve con filas impresas.
		const f = en(FICHA);
		p.push(S(k.slabOf(f, CARRO_TOPE, FICHA_TOPE - CARRO_TOPE, P, 3), { tone: 'hi', lit: true, crease: 'lo' }));
		const texto = api.texto('SELECT', { x: 0, y: 0, peso: 'monoMedium', tam: 6.2, tracking: 0.04 });
		p.push(`<g transform="${k.topMatrix([f.x + 4, f.y + 9], FICHA_TOPE, P, 'x')}" style="fill:var(--anatomy-lit)">${texto}</g>`);
		const filas = [0, 1, 2, 3].map((i) => k.lineOnTop([f.x + 4, f.y + 13.5 + i * 2.8], [f.x + 4 + [24, 20, 23, 17][i], f.y + 13.5 + i * 2.8], FICHA_TOPE, P)).join('');
		p.push(`<g class="anim filas">${L(filas, { tone: 'mid', free: true })}</g>`);
		// Pinzas que sujetan la tarjeta.
		for (const dx of [2, f.w - 8]) p.push(S(k.slabOf({ x: f.x + dx, y: f.y - 1.2, w: 6, d: 2.4, r: 0.8 }, FICHA_TOPE, 0.9, P, 2), { tone: 'mid', crease: 'none' }));
		return `<g class="anim carro">${p.join('')}</g>`;
	}

	function llave() {
		const p = [];
		const bloque = { x: LLAVE_X - 13, y: 24, w: 26, d: 24, r: 2.5 };
		const cx = LLAVE_X;
		const cy = 36;
		p.push(halo(bloque, 0, 0.1, 5));
		p.push(S(k.slabOf(bloque, 0, 20, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(bloque, 6, P, 4), { tone: 'faint' }) }));
		p.push(D(k.corners(bloque, 3).map(([x, y]) => at([x, y, 20])), { size: 0.45 }));
		// Piloto que se enciende cuando la cuenta autoriza la lectura.
		p.push(S(k.cylinder(bloque.x + 5, bloque.y + bloque.d - 5, 1.8, 20, 1.2, P, 16), { tone: 'mid' }));
		p.push(`<g class="anim piloto">${S(k.cylinder(bloque.x + 5, bloque.y + bloque.d - 5, 1.8, 20, 1.2, P, 16), { tone: 'hi', lit: true })}</g>`);
		// Cilindro de la cerradura, con bisel moleteado y la ranura.
		p.push(S(k.cylinder(cx, cy, 6, 20, 3, P, 32, 0.4), { tone: 'mid' }));
		p.push(L(k.knurl(cx, cy, 6, 20, 23, 40, P), { tone: 'lo' }));
		p.push(S(k.cylinder(cx, cy, 4.2, 23, 1.2, P, 28), { tone: 'hi' }));
		// Llave: cuello y paleta de pie, con el agujero de la argolla.
		p.push(S(k.slabOf({ x: cx - 3, y: cy - 0.7, w: 6, d: 1.4, r: 0.5 }, 24.2, 3, P, 2), { tone: 'hi', crease: 'none' }));
		const paleta = { x: cx - 6, y: cy - 0.7, w: 12, d: 1.4, r: 0.6 };
		p.push(S(k.slabOf(paleta, 27.2, 13, P, 3), { tone: 'hi' }));
		p.push(L(k.sideRing([cx, cy + 0.7, 36], 2.2, 'y', P, 20), { tone: 'mid' }));
		return p.join('');
	}

	function archivador() {
		const p = [];
		const a = ARCHIVO;
		const frente = a.y + a.d;
		p.push(halo(a, 0, ARCHIVO_H));
		p.push(S(k.slabOf(k.insetPlan(a, 1.5), 0, 5, P, 4), { tone: 'lo' }));
		p.push(S(k.slabOf(a, 5, ARCHIVO_H - 5, P, 6, 0.8), { tone: 'mid', inner: L(k.sideSeam(a, 40, P, 6) + k.sideSeam(a, 72, P, 6), { tone: 'faint' }) }));
		p.push(S(k.slabOf(k.insetPlan(a, -1.2), ARCHIVO_H, 3, P, 6, 0.6), { tone: 'mid' }));
		p.push(D(k.corners(a, 5).map(([x, y]) => at([x, y, ARCHIVO_H + 3])), { size: 0.5 }));
		// Cajones cerrados (abajo y al medio).
		const cajones = [[10, 38], [41, 69]];
		for (const [z0, z1] of cajones) p.push(frenteCajon(frente, z0, z1, false));
		// Cajón de arriba, abierto: piso, pared izquierda, carpetas, pared derecha y frente.
		const [z0, z1] = [72, 100];
		const x0 = a.x + 6;
		const x1 = a.x + a.w - 6;
		const y0 = frente;
		const y1 = frente + CAJON_ABIERTO;
		p.push(S(k.slabOf({ x: x0, y: y0, w: x1 - x0, d: CAJON_ABIERTO, r: 0.6 }, z0 + 1, 1.2, P, 2), { tone: 'lo', crease: 'none' }));
		p.push(S(k.slabOf({ x: x0, y: y0, w: 1.4, d: CAJON_ABIERTO, r: 0.4 }, z0 + 1, z1 - z0 - 5, P, 2), { tone: 'mid' }));
		const pestanas = [0.18, 0.5, 0.78, 0.32];
		[y0 + 2.5, y0 + 6.5, y0 + 10.5, y0 + 14.5].forEach((y, i) => {
			const carpeta = { x: x0 + 3, y, w: x1 - x0 - 6, d: 1, r: 0.3 };
			const alto = z1 - z0 - 9;
			p.push(S(k.slabOf(carpeta, z0 + 2.2, alto, P, 2), { tone: i === 3 ? 'hi' : 'mid', crease: 'none' }));
			const px = carpeta.x + carpeta.w * pestanas[i];
			p.push(S(k.slabOf({ x: px, y, w: 10, d: 1, r: 0.3 }, z0 + 2.2 + alto, 3, P, 2), { tone: i === 3 ? 'hi' : 'mid', crease: 'none' }));
		});
		p.push(S(k.slabOf({ x: x1 - 1.4, y: y0, w: 1.4, d: CAJON_ABIERTO, r: 0.4 }, z0 + 1, z1 - z0 - 5, P, 2), { tone: 'mid' }));
		p.push(frenteCajon(y1, z0, z1, true));
		return p.join('');
	}

	function frenteCajon(y, z0, z1, abierto) {
		const p = [];
		const a = ARCHIVO;
		const plan = { x: a.x + 4, y, w: a.w - 8, d: 3, r: 1.4 };
		p.push(S(k.slabOf(plan, z0, z1 - z0, P, 3, 0.4), { tone: 'mid' }));
		// El frente del cajón abierto se ilumina cuando llega la consulta.
		if (abierto) p.push(`<g class="anim cajon">${S(k.slabOf(plan, z0, z1 - z0, P, 3, 0.4), { tone: 'mid', lit: true })}</g>`);
		// Portaetiqueta y tirador en la cara del frente.
		const m = k.sideMatrix([plan.x, y + 3], z1, P, 'left');
		const u = plan.w / 2;
		p.push(`<g transform="${m}"><rect x="${u - 9}" y="4" width="18" height="6" rx="0.8" style="fill:var(--anatomy-top)"/><path class="iso-line" data-tone="lo" d="M${u - 9} 4h18v6h-18z"/><path class="iso-line" data-tone="faint" d="M${u - 6} 7h12"/></g>`);
		const yt = y + 3;
		p.push(S(k.slabOf({ x: plan.x + u - 9, y: yt, w: 2.4, d: 3, r: 0.6 }, z0 + 9, 3, P, 2), { tone: 'mid', crease: 'none' }));
		p.push(S(k.slabOf({ x: plan.x + u + 6.6, y: yt, w: 2.4, d: 3, r: 0.6 }, z0 + 9, 3, P, 2), { tone: 'mid', crease: 'none' }));
		p.push(S(k.slabOf({ x: plan.x + u - 10, y: yt + 3, w: 20, d: 2.4, r: 1 }, z0 + 8.6, 3.8, P, 3), { tone: 'mid' }));
		return p.join('');
	}

	function esquinas() {
		const p = [];
		p.push(api.texto('Fig. 1', { x: 24, y: 34, peso: 'monoMedium', tam: 12, clase: 't-suave' }));
		p.push(api.texto('PROTHEUS-DB-MCP · SOLO LECTURA', { x: ANCHO - 24, y: 34, peso: 'monoMedium', tam: 11.5, tracking: 0.08, ancla: 'end', clase: 't-tenue' }));
		p.push(api.texto('UNA CONSULTA DE UN AGENTE, PASO A PASO', { x: 24, y: ALTO_TARJETA - 22, peso: 'monoMedium', tam: 11.5, tracking: 0.08, clase: 't-tenue' }));
		LECTURAS.forEach((l) => {
			p.push(`<g class="anim lectura ${l.clase}">${api.texto(l.texto, { x: ANCHO - 24, y: ALTO_TARJETA - 22, peso: 'monoMedium', tam: 12, ancla: 'end', clase: 't-texto' })}</g>`);
		});
		return p.join('');
	}

	function leyenda() {
		const p = [];
		const y0 = ALTO_TARJETA + 16;
		const colW = (ANCHO - 16) / 2;
		CAPAS.forEach((c, i) => {
			const x = (i % 2) * (colW + 16);
			const y = y0 + Math.floor(i / 2) * 58;
			p.push(`<rect x="${x + 0.5}" y="${y + 0.5}" width="27" height="21" rx="6" style="fill:var(--tarjeta2);stroke:var(--borde)"/>`);
			p.push(api.texto(c.n, { x: x + 14, y: y + 15, peso: 'monoMedium', tam: 11, ancla: 'middle', clase: 't-acento' }));
			p.push(api.texto(c.titulo, { x: x + 38, y: y + 15, peso: 'semibold', tam: 14, clase: 't-texto' }));
			api.partir(c.texto, colW - 46, { peso: 'regular', tam: 13 }).forEach((linea, j) => p.push(api.texto(linea, { x: x + 38, y: y + 35 + j * 18, peso: 'regular', tam: 13, clase: 't-suave' })));
		});
		return p.join('');
	}
}

// Las cuatro capas, tal como las describe el README del repo.
const CAPAS = [
	{ n: '01', titulo: 'Guardia léxica', texto: 'Un analizador por dialecto solo deja pasar SELECT o WITH.' },
	{ n: '02', titulo: 'Transacción de solo lectura', texto: 'SQL Server revierte siempre; PostgreSQL y Oracle: READ ONLY.' },
	{ n: '03', titulo: 'Límites', texto: '500 filas por defecto (máx. 5000) y 30 s de espera (máx. 300 s).' },
	{ n: '04', titulo: 'La cuenta', texto: 'Usuario con permisos solo de SELECT: la única garantía real.' },
];

const LECTURAS = [
	{ clase: 'l0', texto: 'protheus_query_readonly' },
	{ clase: 'l1', texto: '01 · SELECT aceptado' },
	{ clase: 'l2', texto: '02 · transacción de solo lectura' },
	{ clase: 'l3', texto: '03 · hasta 500 filas · 30 s' },
	{ clase: 'l4', texto: '04 · cuenta con permiso SELECT' },
	{ clase: 'l5', texto: 'filas leídas · nada escrito' },
];


