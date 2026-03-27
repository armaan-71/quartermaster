/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          sidebar: '#f7f6f3',
          border: '#edece9',
          text: '#37352f',
          muted: '#9ca3af',
          hover: '#efefef',
          primary: '#2383e2',
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        'sm': '3px',
        'md': '5px',
        'lg': '8px',
      }
    },
  },
  plugins: [],
}
