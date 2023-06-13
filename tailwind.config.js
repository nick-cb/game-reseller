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
    },
  },
  plugins: [],
};
