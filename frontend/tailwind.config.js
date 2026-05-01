/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-uae-navy',
    'bg-uae-gold-600',
    'bg-uae-red-600',
    'bg-uae-green-600',
    'bg-purple-600',
    'bg-amber-600',
    'bg-teal-600',
    'bg-rose-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-red-600',
    'bg-cyan-600',
  ],
  theme: {
    extend: {
      colors: {
        // UAE Government Official Design System Colors (AEGOV DLS)
        uae: {
          // Primary — AEGold (official UAE gold palette)
          gold: {
            50: '#F9F7ED',
            100: '#F2ECCF',
            200: '#E6D7A2',
            300: '#D7BC6D',
            400: '#CBA344',
            500: '#B68A35',
            600: '#92722A',
            700: '#7C5E24',
            800: '#6C4527',
            900: '#5D3B26',
          },
          // Primary — AERed
          red: {
            50: '#FEF2F2',
            100: '#FDE4E3',
            200: '#FDCDCB',
            300: '#FAAAA7',
            400: '#F47A75',
            500: '#EA4F49',
            600: '#D83731',
            700: '#B52520',
            800: '#95231F',
            900: '#7C2320',
          },
          // Primary — AEGreen
          green: {
            50: '#F3FAF4',
            100: '#E4F4E7',
            200: '#CAE8CF',
            300: '#A0D5AB',
            400: '#6FB97F',
            500: '#4A9D5C',
            600: '#3F8E50',
            700: '#2F663C',
            800: '#2A5133',
            900: '#24432B',
          },
          // Navy — derived from Slate/AEBlack for professional look
          navy: '#334155',     // slate-700 — professional medium tone
          'navy-light': '#475569', // slate-600
          'navy-dark': '#1E293B',  // slate-800
        },
        // Neutral — AEBlack official palette
        neutral: {
          50: '#F7F7F7',
          100: '#E1E3E5',
          200: '#C3C6CB',
          300: '#9EA2A9',
          400: '#797E86',
          500: '#5F646D',
          600: '#4B4F58',
          700: '#3E4046',
          800: '#232528',
          900: '#1B1D21',
        },
        // Slate — used for backgrounds and subtle UI
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
