// tailwind.config.js
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0E1528',
        frosted: 'rgba(14,21,40,0.8)',
        accentLo: '#16E4E8',
        accentHi: '#1FBED4',
      },
      boxShadow: {
        card: '0 6px 25px 0 rgba(0,0,0,0.35)',
        glow: '0 0 12px rgba(22,228,232,0.45)',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        'html, :host': {
          '-webkit-text-size-adjust': '100%',
          '-ms-text-size-adjust': '100%',
          'text-size-adjust': '100%',
        },
      });
    }),
  ],
};
