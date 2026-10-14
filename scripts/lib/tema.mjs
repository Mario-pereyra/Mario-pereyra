// Paletas de los dos temas: gruvbox oscuro (hard) y gruvbox claro, los colores de un vim de toda la vida.
export const TEMAS = {
	oscuro: {
		ventana: '#1d2021',
		barra: '#282828',
		lateral: '#1a1c1d',
		seleccion: '#32302f',
		borde: '#3c3836',
		texto: '#ebdbb2',
		tenue: '#7c6f64',
		comentario: '#928374',
		clave: '#83a598',
		cadena: '#b8bb26',
		signo: '#fe8019',
		carpeta: '#fabd2f',
		modo: '#a89984',
		sobreModo: '#1d2021',
		rojo: '#fb4934',
		amarillo: '#fabd2f',
		verde: '#b8bb26',
		cursor: '#ebdbb2',
	},
	claro: {
		ventana: '#fbf1c7',
		barra: '#f2e5bc',
		lateral: '#f5ebc1',
		seleccion: '#ebdbb2',
		borde: '#d5c4a1',
		texto: '#3c3836',
		tenue: '#a89984',
		comentario: '#928374',
		clave: '#076678',
		cadena: '#79740e',
		signo: '#af3a03',
		carpeta: '#b57614',
		modo: '#7c6f64',
		sobreModo: '#fbf1c7',
		rojo: '#cc241d',
		amarillo: '#d79921',
		verde: '#98971a',
		cursor: '#3c3836',
	},
};

/** Variables CSS del tema, para usar en <style> como var(--texto), etc. */
export function variables(t) {
	return Object.entries(t)
		.map(([k, v]) => `--${k}:${v}`)
		.join(';');
}
