/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#090D16',
        slate: { 950: '#0B0F19', 900: '#111827', 800: '#1E293B' },
        indigo: { 500: '#6366F1', 600: '#4F46E5' },
        emerald: { 500: '#10B981' },
        copy: { 100: '#F8FAFC', 400: '#94A3B8', 500: '#64748B' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      borderRadius: { xl: '12px', '2xl': '18px' },
      boxShadow: { glow: '0 0 34px rgba(99, 102, 241, .32)' }
    }
  },
  plugins: []
};
