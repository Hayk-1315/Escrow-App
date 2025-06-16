/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in-out': 'fadeInOut 5s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%': { opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { opacity: 0 }
        }
      },
      colors: {
        electric: '#00bfff',
        lava: '#ff7a00',
      },
    },
  },
  plugins: [],
}
