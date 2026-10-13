// Paletas de los dos temas. Mismos colores que la página personal (mario-pereyra.github.io),
// ajustados al fondo de GitHub: #0d1117 en oscuro y #ffffff en claro.
export const TEMAS = {
	oscuro: {
		lienzo: '#0d1117',
		tarjeta: '#10151a',
		tarjeta2: '#141b21',
		borde: '#232c34',
		bordeFuerte: '#33404b',
		brillo: 'rgba(255,255,255,0.07)',
		texto: '#e6edf3',
		suave: '#9ba7b3',
		tenue: '#6c7885',
		acento: '#5fd4c4',
		sobreAcento: '#062320',
		erp: '#e8b866',
		ia: '#ab9dff',
		rejilla: 'rgba(255,255,255,0.045)',
		halo: 0.22,
		sombra: 'rgba(0,0,0,0.45)',
	},
	claro: {
		lienzo: '#ffffff',
		tarjeta: '#ffffff',
		tarjeta2: '#f6f8f8',
		borde: '#e1e6ea',
		bordeFuerte: '#c9d1d8',
		brillo: 'rgba(255,255,255,0)',
		texto: '#1b1f24',
		suave: '#57606a',
		tenue: '#7d8790',
		acento: '#0e7c72',
		sobreAcento: '#ffffff',
		erp: '#9a6700',
		ia: '#6550d4',
		rejilla: 'rgba(15,23,42,0.055)',
		halo: 0.12,
		sombra: 'rgba(15,23,42,0.06)',
	},
};

/** Variables CSS del tema, para usar en <style> como var(--texto), etc. */
export function variables(t) {
	return Object.entries(t)
		.filter(([, v]) => typeof v === 'string')
		.map(([k, v]) => `--${k}:${v}`)
		.join(';');
}
