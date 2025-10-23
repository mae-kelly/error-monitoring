/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0f',
        'cyber-darkblue': '#0f1419',
        'cyber-blue': '#00d4ff',
        'cyber-cyan': '#00ffff',
        'cyber-purple': '#a855f7',
        'cyber-pink': '#ff00ff',
        'cyber-magenta': '#ff00aa',
        'cyber-green': '#00ff88',
        'cyber-yellow': '#ffff00',
        'cyber-orange': '#ff8800',
        'cyber-red': '#ff0044',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.6)' }
        },
      },
    },
  },
  plugins: [],
}