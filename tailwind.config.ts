import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-gray-400', 'text-gray-900',
    'bg-red-500', 'text-red-100',
    'bg-blue-500', 'text-blue-100',
    'bg-yellow-400', 'text-yellow-900',
    'bg-green-500', 'text-green-100',
    'bg-blue-200', 'text-blue-900',
    'bg-red-700', 'text-red-100',
    'bg-purple-500', 'text-purple-100',
    'bg-yellow-700', 'text-yellow-100',
    'bg-blue-300', 'text-blue-900',
    'bg-pink-500', 'text-pink-100',
    'bg-green-700', 'text-green-100',
    'bg-yellow-800', 'text-yellow-100',
    'bg-purple-800', 'text-purple-100',
    'bg-indigo-500', 'text-indigo-100',
    'bg-gray-800', 'text-gray-100',
    'bg-gray-600', 'text-gray-100',
    'bg-pink-300', 'text-pink-900',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
