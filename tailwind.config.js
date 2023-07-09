const gridColRepeatMinMax = require('./minmax');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        default: "hsl(0, 0%, 11%)",
        paper: "hsl(0, 0%, 20%)",
        paper_2: "hsl(0, 0%, 16%)",
        white_primary: "hsl(0, 0%, 96%)",
        primary: "hsl(209, 100%, 45%)",
      },
      screens: {
        'xs': '384px',
        'xs-right-pad': '400px',
        '3/4sm': '480px',
        '3xl': '1792px',
        '4xl': '2048px',
      },
      height: {
        18: "4.5rem /* 72px */"
      },
      gridTemplateColumns: {
        '1': "repeat(1, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '2': "repeat(2, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '3': "repeat(3, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '4': "repeat(4, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '5': "repeat(5, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '6': "repeat(6, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '7': "repeat(7, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '8': "repeat(8, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '9': "repeat(9, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '10': "repeat(10, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '11': "repeat(11, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
        '12': "repeat(12, minmax(var(--tw-cols-min), var(--tw-cols-max)))",
      }
    },
  },
  plugins: [gridColRepeatMinMax],
};
