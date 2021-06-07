module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        whatsapp_green: {
          light: "#24CC63",
          DEFAULT: "#11887A",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
