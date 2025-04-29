import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				heading: "'Bebas Neue', serif",
				subheading: "'Spline Sans', sans-serif",
				body: "'Kanit', serif",
			},
			colors: {
				bg: "#1A1A1A",
				text: "#EFEFEF",
				primary: "#232323",
				secondary: "#2A2A2A",
				tertiary: "#353535",
				accent: "#57C5A0",
				accent2: "#94B796",
			},
		},
	},

	plugins: [typography, forms, containerQueries],
} satisfies Config;
