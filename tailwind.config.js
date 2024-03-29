module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Barlow Condensed",
          "Roboto Condensed",
          "Arial Narrow",
          "Arial",
          "sans-serif",
        ],
        label: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
      },
      colors: {
        text: "#2c3e50",
        "smoke-100": "#f1f4f2",
        "smoke-200": "#e7ebe9",
        "smoke-300": "#dfe5e2",
        "smoke-400": "#aaaeaa",
        "smoke-500": "#b5c0bd",
        "smoke-600": "#869893",
        "smoke-700": "#54635f",
        "smoke-800": "#38423f",
        "smoke-900": "#1C2120",
        qblue: "rgb(70, 150, 200)",
        tagyellow: "#FFB400",
        "tagyellow-bright": "#FFD87A",
      },
      screens: {
        low: { raw: "(max-height: 1000px)" },
        high: "2000px",
      },
      keyframes: {
        throb: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        throb: "throb .4s infinite alternate both",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2.5rem",
      },
    },
  },
  plugins: [require("@vueform/slider/tailwind")],
};
