// La tabla «cat stack.yaml» del README: un ícono por tecnología, con su nombre como tooltip.
// «ya» es nivel intermedio o avanzado y «aprendiendo» es básico (docs/perfil.md de marca-personal).
// Cada ícono sale de skillicons.dev (`skill`, ver scripts/iconos.mjs) o se dibuja en
// scripts/piezas/baldosas.mjs (`logo` o `letras`).

export const ICONOS = {
	// Lenguajes
	ts: { nombre: 'TypeScript', skill: 'ts' },
	js: { nombre: 'JavaScript', skill: 'js' },
	java: { nombre: 'Java', skill: 'java' },
	html: { nombre: 'HTML', skill: 'html' },
	css: { nombre: 'CSS', skill: 'css' },
	advpl: { nombre: 'AdvPL', letras: { texto: 'AdvPL', color: 'naranja' } },
	sql: { nombre: 'SQL', letras: { texto: 'SQL', color: 'azul' } },
	python: { nombre: 'Python', skill: 'python' },
	go: { nombre: 'Go', skill: 'go' },
	rust: { nombre: 'Rust', skill: 'rust' },
	kotlin: { nombre: 'Kotlin', skill: 'kotlin' },
	// Backend
	nodejs: { nombre: 'Node.js', skill: 'nodejs' },
	express: { nombre: 'Express', skill: 'express' },
	sequelize: { nombre: 'Sequelize', skill: 'sequelize' },
	typeorm: { nombre: 'TypeORM', logo: { archivo: 'typeorm.svg', relleno: '#FE0803', tam: 150 } },
	nestjs: { nombre: 'NestJS', skill: 'nestjs' },
	prisma: { nombre: 'Prisma', skill: 'prisma' },
	// Frontend
	react: { nombre: 'React', skill: 'react' },
	reactrouter: { nombre: 'React Router', logo: { archivo: 'reactrouter.svg', relleno: '#CA4245', tam: 160 } },
	nextjs: { nombre: 'Next.js', skill: 'nextjs' },
	angular: { nombre: 'Angular', skill: 'angular' },
	tailwind: { nombre: 'Tailwind CSS', skill: 'tailwind' },
	// Datos
	postgres: { nombre: 'PostgreSQL', skill: 'postgres' },
	sqlserver: { nombre: 'SQL Server', logo: { archivo: 'sqlserver.svg', tam: 170 } },
	mysql: { nombre: 'MySQL', skill: 'mysql' },
	redis: { nombre: 'Redis', skill: 'redis' },
	// DevOps y pruebas
	git: { nombre: 'Git', skill: 'git' },
	docker: { nombre: 'Docker', skill: 'docker' },
	cloudflare: { nombre: 'Cloudflare', skill: 'cloudflare' },
	vercel: { nombre: 'Vercel', skill: 'vercel' },
	githubactions: { nombre: 'GitHub Actions', skill: 'githubactions' },
	vitest: { nombre: 'Vitest', skill: 'vitest' },
	jest: { nombre: 'Jest', skill: 'jest' },
	// IA
	claude: { nombre: 'Claude Code', logo: { archivo: 'claude.svg', relleno: '#D97757', tam: 150 } },
	codex: { nombre: 'Codex', logo: { archivo: 'openai.svg', relleno: { oscuro: '#FFFFFF', claro: '#000000' }, tam: 140 } },
	opencode: { nombre: 'OpenCode', logo: { archivo: { oscuro: 'opencode-dark.svg', claro: 'opencode-light.svg' }, tam: 170 } },
	pi: { nombre: 'Pi', logo: { archivo: 'pi.svg', relleno: { oscuro: '#F6F6F6', claro: '#111111' }, tam: 130 } },
	mcp: { nombre: 'Servidores MCP', logo: { archivo: 'mcp.svg', relleno: { oscuro: '#FFFFFF', claro: '#000000' }, tam: 150 } },
	deepseek: { nombre: 'API de DeepSeek', logo: { archivo: 'deepseek.svg', tam: 160 } },
	glm: { nombre: 'API de GLM (Zhipu)', logo: { archivo: 'zhipu.svg', tam: 150 } },
	// ERP
	totvs: { nombre: 'TOTVS Protheus', logo: { archivo: 'totvs.svg', relleno: { oscuro: '#FFFFFF', claro: '#363636' }, tam: 150 } },
	sigafat: { nombre: 'Facturación (SIGAFAT)', letras: { texto: 'FAT', previo: 'SIGA', color: 'naranja' } },
	sigacom: { nombre: 'Compras (SIGACOM)', letras: { texto: 'COM', previo: 'SIGA', color: 'naranja' } },
};

// Filas de la tabla. `texto` va como etiquetas de código cuando no hay una herramienta que mostrar.
export const FILAS = [
	{ area: 'lenguajes', ya: ['ts', 'js', 'java', 'html', 'css', 'advpl', 'sql'], aprendiendo: ['python', 'go', 'rust', 'kotlin'] },
	{ area: 'backend', ya: ['nodejs', 'express', 'sequelize', 'typeorm'], aprendiendo: ['nestjs', 'prisma'] },
	{ area: 'frontend', ya: ['react', 'reactrouter'], aprendiendo: ['nextjs', 'angular', 'tailwind'] },
	{ area: 'datos', ya: ['postgres', 'sqlserver'], aprendiendo: ['mysql', 'redis'] },
	{ area: 'devops_y_pruebas', ya: ['git', 'docker', 'cloudflare', 'vercel'], aprendiendo: ['githubactions', 'vitest', 'jest'] },
	{ area: 'ia', ya: ['claude', 'codex', 'opencode', 'pi', 'mcp', 'deepseek', 'glm'], aprendiendo: [], texto: ['ingeniería de contexto', 'harness', 'pruebas de agentes'] },
	{ area: 'erp', ya: ['totvs', 'sigafat'], aprendiendo: ['sigacom'] },
];
