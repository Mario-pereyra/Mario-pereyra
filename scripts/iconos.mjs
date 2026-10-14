// Descarga los logos del stack desde skillicons.dev (licencia MIT, ver assets/stack/LICENSE-skill-icons)
// y los guarda en assets/stack/, así el README no depende del servicio: `npm run iconos`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cada fila de la tabla del README: «ya» es intermedio o avanzado, «aprendiendo» es básico (docs/perfil.md).
const FILAS = {
	'lenguajes-ya': 'ts,js,java,html,css',
	'lenguajes-aprendiendo': 'python,go,rust,kotlin',
	'backend-ya': 'nodejs,express',
	'backend-aprendiendo': 'nestjs,prisma',
	'frontend-ya': 'react',
	'frontend-aprendiendo': 'nextjs,angular,tailwind',
	'datos-ya': 'postgres',
	'datos-aprendiendo': 'mysql,redis',
	'devops-ya': 'git,docker,cloudflare,vercel',
	'devops-aprendiendo': 'githubactions,vitest,jest',
};
const TEMAS = { oscuro: 'dark', claro: 'light' };

const salida = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'stack');
mkdirSync(salida, { recursive: true });

for (const [fila, iconos] of Object.entries(FILAS)) {
	for (const [tema, theme] of Object.entries(TEMAS)) {
		const respuesta = await fetch(`https://skillicons.dev/icons?i=${iconos}&theme=${theme}`);
		if (!respuesta.ok) throw new Error(`${fila} (${tema}): HTTP ${respuesta.status}`);
		const svg = await respuesta.text();
		if (!svg.trimStart().startsWith('<svg') || /<script/i.test(svg)) throw new Error(`${fila} (${tema}): respuesta inesperada`);
		writeFileSync(join(salida, `${fila}-${tema}.svg`), svg);
		console.log(`stack/${fila}-${tema}.svg`);
	}
}
