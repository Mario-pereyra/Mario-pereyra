// Contenido público del README. Sale de la marca personal de Mario (perfil y proyectos verificados).
// Nada de teléfono, edad ni nombres de clientes.
export const PERFIL = {
	nombre: ['Mario Alberto', 'Pereyra Justiniano'],
	lugar: 'Santa Cruz de la Sierra, Bolivia',
	lema: 'Del requerimiento del cliente al código en producción.',
	roles: ['Desarrollador', 'Consultor TOTVS Protheus', 'Estudiante de Ing. de Sistemas · 7.º semestre'],
	chips: [
		{ texto: 'Consultor TOTVS Protheus', color: 'erp' },
		{ texto: 'Estudiante de Ing. de Sistemas · 7.º semestre', color: null },
	],
	enlaces: {
		pagina: 'https://mario-pereyra.github.io',
		cv: 'https://mario-pereyra.github.io/cv/CV_Mario_Pereyra_Justiniano.pdf',
		linkedin: 'https://www.linkedin.com/in/mario-pereyra-justiniano-86b205304',
		correo: 'mailto:mario1w3p.j@gmail.com',
	},
};

// Flujo de la portada: del proceso del cliente al agente de IA.
export const FLUJO = [
	{ titulo: 'Proceso del cliente', detalle: 'Relevamiento · Facturación', color: 'erp' },
	{ titulo: 'Código', detalle: 'AdvPL · SQL · TypeScript', color: 'acento' },
	{ titulo: 'Agentes de IA', detalle: 'MCP · solo lectura', color: 'ia' },
];

export const PILARES = [
	{
		n: '01',
		titulo: 'Desarrollo',
		color: 'acento',
		texto: 'Construyo aplicaciones web con TypeScript, React, Node.js y PostgreSQL.',
		prueba: 'Vintage Secret’s · en producción',
	},
	{
		n: '02',
		titulo: 'Software empresarial',
		color: 'erp',
		texto: 'Personalizo el ERP TOTVS Protheus con AdvPL y SQL para empresas cliente.',
		prueba: 'Resultar · desde oct. 2025',
	},
	{
		n: '03',
		titulo: 'IA aplicada',
		color: 'ia',
		texto: 'Conecto agentes de IA a bases de datos de Protheus, en solo lectura, con MCP.',
		prueba: 'protheus-db-mcp · 4 capas',
	},
];

// Cifras de Resultar: las de código salen del historial de git (enero a octubre de 2026);
// la salida en vivo, de la autoevaluación de Mario.
export const RESULTAR = { titulo: 'En Resultar Soluciones SRL', periodo: 'Oct. 2025 – hoy' };
export const CIFRAS = [
	{ valor: '4', texto: ['empresas cliente', 'con mis desarrollos'] },
	{ valor: '8', texto: ['programas nuevos', 'en AdvPL'] },
	{ valor: '20', texto: ['archivos fuente', 'modificados'] },
	{ valor: '10', texto: ['correcciones', 'de errores'] },
	{ valor: '1', texto: ['salida en vivo', '(go-live)'] },
];
export const NOTA_CIFRAS = 'Resultar Soluciones SRL · enero a octubre de 2026 · reportes, puntos de entrada y rutinas, sobre todo de Facturación';

// Stack por nivel, como en docs/perfil.md (autoevaluación de Mario del 2026-10-13).
// Rust queda fuera, igual que en el CV: es básico y no tiene repos.
export const NIVELES = [
	{ nombre: 'Avanzado', barras: 3 },
	{ nombre: 'Intermedio', barras: 2 },
	{ nombre: 'Básico', barras: 1 },
];
export const STACK = [
	{ area: 'Lenguajes', niveles: [['HTML', 'CSS'], ['JavaScript', 'TypeScript', 'SQL', 'AdvPL', 'Java'], ['Python', 'Go', 'Kotlin']] },
	{ area: 'Backend y ORM', niveles: [[], ['Node.js', 'Express', 'Sequelize', 'TypeORM'], ['NestJS', 'Prisma']] },
	{ area: 'Frontend', niveles: [[], ['React', 'React Router'], ['Angular', 'Next.js', 'Tailwind CSS']] },
	{ area: 'Bases de datos', niveles: [[], ['SQL Server', 'PostgreSQL'], ['MySQL', 'Redis']] },
	{ area: 'Herramientas y nube', niveles: [[], ['Git', 'Docker', 'Vercel', 'Cloudflare Workers y R2'], ['GitHub Actions', 'Vitest', 'Jest']] },
	{ area: 'IA', color: 'ia', niveles: [['Agentes de codificación', 'APIs de DeepSeek y GLM'], ['Servidores MCP'], []] },
	{ area: 'ERP Protheus', color: 'erp', niveles: [[], ['Facturación (SIGAFAT)'], ['Compras (SIGACOM)']] },
];
