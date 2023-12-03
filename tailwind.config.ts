import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
  darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#f4f9f9',
					'100': '#dbecea',
					'200': '#b7d8d7',
					'300': '#8abebe',
					'400': '#629e9f',
					'500': '#488284',
					'600': '#3c6e71',
					'700': '#305355',
					'800': '#294446',
					'900': '#26393b',
					'950': '#121f21',
				},
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
export default config;
