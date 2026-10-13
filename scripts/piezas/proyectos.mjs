// Tarjetas de proyectos: tres SVG que, puestos lado a lado al 33,33 % en el README, forman una
// fila con las mismas columnas que el bento. Cada SVG reserva su parte del espacio entre tarjetas.
// Arriba, cada tarjeta muestra el mecanismo que la distingue, con datos verificados en el repo.
import { documento, tarjeta, halo, rotulo, ficha, r2 } from '../lib/svg.mjs';

const FILA = 880;
const GAP = 12;
const W = FILA / 3;
const CW = (FILA - GAP * 2) / 3;
const ALTO = 372;

const CSS = `
@keyframes ping{0%{transform:scale(1);opacity:.5}14%,100%{transform:scale(2);opacity:0}}
.ping{transform-box:fill-box;transform-origin:center;opacity:0;animation:ping 6s ease-out infinite}
@keyframes fluye{to{stroke-dashoffset:-18}}
.conector{stroke-dasharray:3 6;animation:fluye 1.4s linear infinite}
@keyframes viaja{0%{transform:translateX(0);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translateX(var(--dx));opacity:0}}
.viaja{animation:viaja 2.8s cubic-bezier(.45,0,.55,1) infinite}
@keyframes esquina{0%{transform:translate(0,0);opacity:0}10%{opacity:1}62%{transform:translate(var(--dx),0)}86%{transform:translate(var(--dx),var(--dy));opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
.esquina{animation:esquina 3.2s cubic-bezier(.45,0,.55,1) infinite}
@keyframes rebota{0%{transform:translateX(0);opacity:0}12%{opacity:1}62%{transform:translateX(var(--dx));opacity:1}100%{transform:translateX(var(--dx));opacity:0}}
.rebota{animation:rebota 3.2s cubic-bezier(.45,0,.55,1) .5s infinite}
@keyframes respira{0%,100%{opacity:.6}50%{opacity:1}}
.respira{animation:respira 3.2s ease-in-out infinite}
`;

const PROYECTOS = [
	{
		id: 'vintage',
		rotulo: 'Emprendimiento familiar',
		marca: 'var(--acento)',
		titulo: 'Vintage Secret’s',
		texto: 'Catálogo de carteras y panel de inventario con rentabilidad por lote y por proveedor.',
		stack: ['React Router', 'TypeScript', 'Cloudflare Workers', 'PostgreSQL'],
		enlace: 'Ver la demo',
		estado: 'En producción',
		panel: panelCI,
		descripcion:
			'Vintage Secret’s, emprendimiento familiar en producción: catálogo de carteras y panel de inventario con rentabilidad por lote y por proveedor. React Router, TypeScript, Cloudflare Workers y PostgreSQL. Cada push a main pasa por GitHub Actions: typecheck, 16 archivos de prueba, build, migraciones de Prisma y despliegue en Workers.',
	},
	{
		id: 'quiniela',
		rotulo: 'Universidad · equipo de 2',
		marca: 'var(--bordeFuerte)',
		titulo: 'Quiniela Mundial 2026',
		texto: 'Mi aporte: sincronización de partidos reales con TheSportsDB y el frontend inicial en React.',
		stack: ['NestJS', 'PostgreSQL', 'React', 'Leaflet', 'Docker'],
		enlace: 'Ver la demo',
		estado: 'En línea',
		panel: panelSync,
		descripcion:
			'Quiniela Mundial 2026, proyecto universitario en equipo de 2. Aporte de Mario: la sincronización con la API de TheSportsDB, con 78 partidos reales, y el frontend inicial en React. NestJS, PostgreSQL, React, Leaflet y Docker.',
	},
	{
		id: 'cine',
		rotulo: 'Universidad',
		marca: 'var(--bordeFuerte)',
		titulo: 'Cine Reservas',
		texto: 'Reserva de asientos con control de concurrencia en la base: un asiento no se reserva dos veces.',
		stack: ['NestJS', 'TypeORM', 'PostgreSQL', 'React', 'Docker'],
		enlace: 'Ver el código',
		estado: 'Repo público',
		panel: panelAsientos,
		descripcion:
			'Cine Reservas, proyecto universitario: reserva de asientos con control de concurrencia en la base de datos, para que dos solicitudes no reserven el mismo asiento. NestJS, TypeORM, PostgreSQL, React y Docker, con 7 archivos de prueba.',
	},
];

export function proyectos(tema) {
	const salida = {};
	PROYECTOS.forEach((p, i) => {
		salida[p.id] = documento({
			id: `proyecto-${p.id}`,
			ancho: r2(W),
			alto: ALTO,
			tema,
			titulo: p.titulo,
			descripcion: p.descripcion,
			css: CSS,
			dibujar: (api) => dibujar(api, p, i * (W - CW) / 2),
		});
	});
	return salida;
}

function dibujar(api, p, x) {
	const { t } = api;
	const out = [];
	const caja = { x, y: 0, w: CW, h: ALTO, r: 14 };
	out.push(tarjeta(api, caja));
	out.push(halo(api, { ...caja, cx: x + CW - 30, cy: 0, rx: 200, ry: 150, color: t.acento, opacidad: t.halo * 0.45 }));

	// Panel superior con el mecanismo del proyecto.
	const panel = { x: x + 12, y: 12, w: CW - 24, h: 122 };
	out.push(tarjeta(api, { ...panel, r: 10, clase: 'tarjeta2', brillo: false }));
	out.push(p.panel(api, panel));

	const tx = x + 20;
	out.push(rotulo(api, p.rotulo, { x: tx, y: 162, marca: p.marca }));
	out.push(api.texto(p.titulo, { x: tx, y: 190, peso: 'semibold', tam: 19, tracking: -0.01, clase: 't-texto' }));
	api.partir(p.texto, CW - 40, { peso: 'regular', tam: 14.5 }).forEach((linea, j) => {
		out.push(api.texto(linea, { x: tx, y: 214 + j * 20, peso: 'regular', tam: 14.5, clase: 't-suave' }));
	});

	// Stack en fichas, en hasta dos filas.
	let fx = tx;
	let fy = 270;
	for (const s of p.stack) {
		const ancho = api.medir(s, { peso: 'medium', tam: 12 }) + 18;
		if (fx + ancho > x + CW - 20) {
			fx = tx;
			fy += 28;
		}
		const f = ficha(api, s, { x: fx, y: fy, alto: 22, tam: 12, padding: 9 });
		out.push(f.svg);
		fx += f.ancho + 6;
	}

	// Pie: adónde lleva la tarjeta y en qué estado está el proyecto.
	out.push(`<path class="linea" d="M${r2(x + 20)} 334.5H${r2(x + CW - 20)}"/>`);
	const anchoEnlace = api.medir(p.enlace, { peso: 'monoMedium', tam: 11.5 });
	out.push(api.texto(p.enlace, { x: tx, y: 357, peso: 'monoMedium', tam: 11.5, clase: 't-acento' }));
	out.push(flecha(tx + anchoEnlace + 9, 353));
	const anchoEstado = api.medir(p.estado, { peso: 'mono', tam: 11.5 });
	out.push(`<circle class="respira" cx="${r2(x + CW - 20 - anchoEstado - 9)}" cy="353" r="3" style="fill:var(--acento)"/>`);
	out.push(api.texto(p.estado, { x: x + CW - 20, y: 357, peso: 'mono', tam: 11.5, ancla: 'end', clase: 't-tenue' }));
	api.alto = ALTO;
	return out.join('\n');
}

const flecha = (x, y) =>
	`<path d="M${x - 3.5} ${y + 3.5}l7-7M${x - 2} ${y - 3.5}h5.5v5.5" style="stroke:var(--acento)" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

const visto = (cx, cy) =>
	`<circle cx="${cx}" cy="${cy}" r="5.5" style="fill:var(--acento)" fill-opacity=".16"/><path d="M${r2(cx - 2.4)} ${cy}l1.7 1.8 3.2-3.6" style="stroke:var(--acento)" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- Vintage: el pipeline real de GitHub Actions (job «verificar» y job «producción») ----------
function panelCI(api, p) {
	const out = [];
	const x = p.x + 16;
	out.push(api.texto('CI/CD · GitHub Actions', { x, y: p.y + 20, peso: 'mono', tam: 11, clase: 't-suave' }));
	const anchoVerde = api.medir('en verde', { peso: 'mono', tam: 11 });
	out.push(`<circle class="respira" cx="${r2(p.x + p.w - 16 - anchoVerde - 8)}" cy="${p.y + 16}" r="3" style="fill:var(--acento)"/>`);
	out.push(api.texto('en verde', { x: p.x + p.w - 16, y: p.y + 20, peso: 'mono', tam: 11, ancla: 'end', clase: 't-acento' }));
	out.push(`<path class="linea" d="M${p.x + 1} ${p.y + 29.5}H${p.x + p.w - 1}"/>`);
	// Los tres primeros pasos son el job «verificar»; los dos últimos, «producción».
	const pasos = [
		{ texto: 'npm run typecheck', job: 'verificar' },
		{ texto: 'npm test · 16 archivos' },
		{ texto: 'npm run build' },
		{ texto: 'prisma migrate deploy', job: 'producción' },
		{ texto: 'wrangler deploy' },
	];
	pasos.forEach((paso, i) => {
		const cy = p.y + 42 + i * 15 + (i >= 3 ? 4 : 0);
		out.push(`<circle class="ping" cx="${x + 5}" cy="${cy}" r="5.5" style="fill:none;stroke:var(--acento);animation-delay:${r2(i * 0.4)}s" stroke-width="1"/>`);
		out.push(visto(x + 5, cy));
		out.push(api.texto(paso.texto, { x: x + 17, y: cy + 4, peso: 'mono', tam: 11, clase: 't-texto' }));
		if (paso.job) out.push(api.texto(paso.job, { x: p.x + p.w - 16, y: cy + 3.5, peso: 'mono', tam: 10, ancla: 'end', clase: 't-tenue' }));
	});
	out.push(`<path class="linea" d="M${x} ${p.y + 83.5}H${p.x + p.w - 16}" style="stroke-dasharray:2 3"/>`);
	return out.join('');
}
// ---------- Quiniela: la sincronización con TheSportsDB ----------
function panelSync(api, p) {
	const out = [];
	const cy = p.y + 50;
	const xs = [p.x + p.w / 6, p.x + p.w / 2, p.x + (5 * p.w) / 6].map(r2);
	const nodos = [
		{ label: 'TheSportsDB', icono: iconoApi },
		{ label: 'NestJS', icono: iconoServidor, propio: true },
		{ label: 'PostgreSQL', icono: iconoBase },
	];
	for (let i = 0; i < 2; i++) {
		const x1 = xs[i] + 24;
		const x2 = xs[i + 1] - 24;
		out.push(`<path class="conector" d="M${x1} ${cy}H${x2}" style="stroke:var(--bordeFuerte)" stroke-width="1.4" fill="none"/>`);
		out.push(`<circle class="viaja" cx="${x1}" cy="${cy}" r="2.6" style="fill:var(--acento);--dx:${r2(x2 - x1)}px;animation-delay:${i * 1.4}s"/>`);
	}
	nodos.forEach((n, i) => {
		const x = xs[i];
		const borde = n.propio ? 'var(--acento)' : 'var(--bordeFuerte)';
		out.push(`<rect x="${r2(x - 21.5)}" y="${cy - 21.5}" width="43" height="43" rx="11" style="fill:var(--tarjeta);stroke:${borde}"/>`);
		if (n.propio) out.push(`<rect x="${r2(x - 21.5)}" y="${cy - 21.5}" width="43" height="43" rx="11" style="fill:var(--acento)" fill-opacity=".08"/>`);
		out.push(n.icono(x, cy, n.propio ? 'var(--acento)' : 'var(--suave)'));
		out.push(api.texto(n.label, { x, y: cy + 39, peso: 'mono', tam: 10.5, ancla: 'middle', clase: n.propio ? 't-texto' : 't-suave' }));
	});
	out.push(api.texto('78 partidos reales en las semillas', { x: p.x + p.w / 2, y: p.y + p.h - 11, peso: 'mono', tam: 10.5, ancla: 'middle', clase: 't-tenue' }));
	return out.join('');
}

const trazo = (color) => `style="stroke:${color}" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
const iconoApi = (x, y, c) =>
	`<path ${trazo(c)} d="M${x - 3} ${y - 7}c-2.2 0-2.6 1-2.6 2.6v1.6c0 1.4-.8 2.2-2.2 2.8 1.4.6 2.2 1.4 2.2 2.8v1.6c0 1.6.4 2.6 2.6 2.6M${x + 3} ${y - 7}c2.2 0 2.6 1 2.6 2.6v1.6c0 1.4.8 2.2 2.2 2.8-1.4.6-2.2 1.4-2.2 2.8v1.6c0 1.6-.4 2.6-2.6 2.6"/>`;
const iconoServidor = (x, y, c) =>
	`<g ${trazo(c)}><rect x="${x - 7.5}" y="${y - 7.5}" width="15" height="6.5" rx="1.8"/><rect x="${x - 7.5}" y="${y + 1}" width="15" height="6.5" rx="1.8"/></g><circle cx="${x - 4.2}" cy="${y - 4.25}" r="1" style="fill:${c}"/><circle cx="${x - 4.2}" cy="${y + 4.25}" r="1" style="fill:${c}"/>`;
const iconoBase = (x, y, c) =>
	`<g ${trazo(c)}><ellipse cx="${x}" cy="${y - 5}" rx="7" ry="2.6"/><path d="M${x - 7} ${y - 5}v10c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-10M${x - 7} ${y}c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6"/></g>`;

// ---------- Cine Reservas: dos solicitudes, un asiento, una reserva ----------
function panelAsientos(api, p) {
	const out = [];
	const cx = p.x + p.w / 2;
	// Pantalla.
	out.push(`<path d="M${r2(cx - 62)} ${p.y + 19}Q${r2(cx)} ${p.y + 11} ${r2(cx + 62)} ${p.y + 19}" style="stroke:var(--bordeFuerte)" fill="none" stroke-width="2" stroke-linecap="round"/>`);
	// Butacas: 9 columnas por 4 filas; algunas ya ocupadas (adorno, sin datos).
	const cols = 9;
	const filas = 4;
	const bw = 12;
	const bh = 9;
	const sep = 5;
	const x0 = cx - (cols * bw + (cols - 1) * sep) / 2;
	const y0 = p.y + 40;
	const ocupadas = new Set(['1-1', '1-2', '1-7', '2-0', '2-5', '2-6', '3-3', '3-4', '3-8', '0-8', '0-0']);
	const objetivo = { f: 0, c: 4 };
	for (let f = 0; f < filas; f++) {
		for (let c = 0; c < cols; c++) {
			const x = x0 + c * (bw + sep);
			const y = y0 + f * 14;
			if (f === objetivo.f && c === objetivo.c) continue;
			const llena = ocupadas.has(`${f}-${c}`);
			out.push(`<rect x="${r2(x + 0.5)}" y="${r2(y + 0.5)}" width="${bw - 1}" height="${bh - 1}" rx="2.5" style="fill:${llena ? 'var(--borde)' : 'var(--tarjeta)'};stroke:var(--bordeFuerte)"/>`);
		}
	}
	// Las dos solicitudes llegan por el pasillo entre la pantalla y la primera fila.
	const sx = r2(x0 + objetivo.c * (bw + sep) + bw / 2);
	const sy = y0;
	const gy = p.y + 30;
	const ax = p.x + 22;
	const bx = p.x + p.w - 22;
	const caminoA = `M${ax + 9} ${gy}H${sx - 4}Q${sx} ${gy} ${sx} ${gy + 4}V${sy - 2}`;
	const caminoB = `M${bx - 9} ${gy}H${sx + 13}`;
	out.push(`<path d="${caminoA}" style="stroke:var(--acento)" fill="none" stroke-width="1.4" stroke-linecap="round"/>`);
	out.push(`<path class="conector" d="${caminoB}" style="stroke:var(--bordeFuerte)" fill="none" stroke-width="1.4"/>`);
	out.push(`<circle class="esquina" cx="${ax + 9}" cy="${gy}" r="2.4" style="fill:var(--acento);--dx:${r2(sx - ax - 9)}px;--dy:${r2(sy - 2 - gy)}px"/>`);
	out.push(`<circle class="rebota" cx="${bx - 9}" cy="${gy}" r="2.4" style="fill:var(--tenue);--dx:${r2(sx + 13 - (bx - 9))}px"/>`);
	// Marca de rechazo al final del camino B.
	const rx = sx + 8;
	out.push(`<path d="M${rx - 2.6} ${gy - 2.6}l5.2 5.2m0-5.2-5.2 5.2" style="stroke:var(--tenue)" fill="none" stroke-width="1.4" stroke-linecap="round"/>`);
	// Butaca reservada.
	const ox = x0 + objetivo.c * (bw + sep);
	out.push(`<rect x="${r2(ox + 0.5)}" y="${r2(sy + 0.5)}" width="${bw - 1}" height="${bh - 1}" rx="2.5" style="fill:var(--acento);stroke:var(--acento)"/>`);
	// Solicitudes A y B.
	const solicitud = (x, letra, aceptada) => [
		`<circle cx="${x}" cy="${gy}" r="8.5" style="fill:var(--tarjeta);stroke:${aceptada ? 'var(--acento)' : 'var(--bordeFuerte)'}"/>`,
		api.texto(letra, { x, y: gy + 3.8, peso: 'monoMedium', tam: 10.5, ancla: 'middle', clase: aceptada ? 't-acento' : 't-tenue' }),
	].join('');
	out.push(solicitud(ax, 'A', true), solicitud(bx, 'B', false));
	out.push(api.texto('2 solicitudes · 1 asiento · 1 reserva', { x: cx, y: p.y + p.h - 11, peso: 'mono', tam: 10.5, ancla: 'middle', clase: 't-tenue' }));
	return out.join('');
}
