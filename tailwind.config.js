/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--primary-color)",
      },
    },
    fontFamily: {
      abc: ["Piazzolla", "serif"],
      cdm: ["Roboto Flex", "sans-serif"],
      second: ["Urbanist", "sans-serif"],
      another: ["Ultra", "serif"],
      poppins: ["Poppins", "sans-serif"],
      ray: ["Raleway", "sans-serif"],
      big: ["Stylish", "sans-serif"],
      open: ["Open Sans", "sans-serif"],
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
    },
  },
  plugins: [require("@shrutibalasa/tailwind-grid-auto-fit")],
};
