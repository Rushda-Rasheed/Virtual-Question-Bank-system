// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     // './src/**/*.{js,ts,jsx,tsx,mdx}',
//     "./src/pages/**/*.{js,ts,jsx,tsx}",
//     "./src/components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };


// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}", // Add this line if using the App directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

