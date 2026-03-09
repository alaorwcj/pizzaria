/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "navy-dark": "#0f172a",
                "navy-deep": "#020617",
                "graphite": "#1e293b",
                "teal-accent": "#2dd4bf",
                "silver-crisp": "#f8fafc",
                "silver-muted": "#94a3b8",
                "border-navy": "#1e293b",
            },
            fontFamily: {
                "sans": ["'Public Sans'", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.125rem",
                "md": "0.375rem",
                "lg": "0.5rem",
            },
        },
    },
    plugins: [],
}
