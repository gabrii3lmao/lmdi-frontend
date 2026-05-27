/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,vue,tsx,jsx,ts}"],
  theme: {
    extend: {
      colors: {
        // Redirecionando a cor "indigo" (o antigo azul padrão) para um verde "lousa escolar" elegante e premium.
        // Isso transforma instantaneamente os botões e detalhes do app em um tom acadêmico super harmônico.
        indigo: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Verde lousa acadêmico principal (Chalkboard Green)
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Cores secundárias voltadas para tons de branco, cinza e ardósia escolar
        school: {
          50: '#f8fafc',   // Branco giz suave (chalk white)
          100: '#f1f5f9',  // Cinza claro escolar
          200: '#e2e8f0',  // Cinza médio claro
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',  // Tom de ardósia escura
          800: '#1e293b',  // Cinza grafite profundo
          900: '#0f172a',  // Tom lousa escura / grafite premium
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        serif: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};
