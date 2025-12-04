/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                light: '#f8fafc',
                card: '#ffffff',
                accent: '#8b5cf6',
                border: '#e2e8f0'
            }
        },
    },
    plugins: [],
}
