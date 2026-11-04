import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// provide you all fonts, make sure to add variable properly and add that on tailwindcss.config. to use on  tailwindcss.config.js: inter: 'var(--font-inter)', (line no: 12)
const fontList = [inter];

export const fontVariables = fontList.map((font) => font.variable).join(" ");
