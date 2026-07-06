/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2f4b4b',
        secondary: '#2c5a38',
        accent: '#64748B',
        light: '#f1f5f9',
        dark: '#1E293B',
      },
      fontFamily: {
        serif: ['Cambria', 'Cochin', 'Georgia', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}
