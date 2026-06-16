/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{html,js,vue,tsx,jsx,ts}"],
  theme: {
    extend: {
      colors: {
        // Redirecionando a cor "indigo" para verde "lousa escolar" (já existente)
        indigo: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Paleta escolar (já existente)
        school: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Superfície clara (light) / escura (dark) semânticas
        surface: {
          DEFAULT: '#ffffff',           // bg branco
          muted: '#f8fafc',             // bg-slate-50
          card: '#ffffff',              // cartão
          border: '#e2e8f0',            // slate-200
          'border-muted': '#cbd5e1',    // slate-300
          text: '#0f172a',              // slate-900
          'text-muted': '#64748b',      // slate-500
          'text-subtle': '#94a3b8',     // slate-400
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
