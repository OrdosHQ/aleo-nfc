// tailwind.config.js
const {
    nextui
} = require("@nextui-org/react");
const typography = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins']
            },
        },
    },
    darkMode: "class",
    plugins: [nextui(), typography()],
};