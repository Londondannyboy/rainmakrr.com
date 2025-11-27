/** @type {import('tailwindcss').Config} */
export default {
	// Scoped to company pages only - homepage uses custom inline CSS for performance
	content: [
		'./src/pages/private-equity-placement-agents-list/**/*.astro',
	],
	theme: {
		extend: {},
	},
	plugins: [],
}
