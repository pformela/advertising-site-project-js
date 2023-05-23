const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      fontSize: {
        "16xl": "16rem",
        "32xl": "32rem",
      },
      colors: {
        lightWheat: "#eff2e1",
        wheat: "#EAE7B1",
        lightGreen: "#A6BB8D",
        green: "#61876E",
        darkGreen: "#3C6255",
        lightCyan: "#C7E8E8",
        whiteRgba: "rgba(255, 255, 255, 0.5)",
        blackRgba: "rgba(0, 0, 0, 0.3)",
        lightGray: "#F5F5F5",
        neonGreen: "#00FF00",
      },
      height: {
        128: "32rem",
      },
      translate: {
        50: "-50%",
      },
    },
  },
  variants: {
    extend: {
      colors: {},
    },
    fill: ["hover", "focus"],
  },
  plugins: [],
};
