/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: {
          black: '#000000',
          matte: '#0B0B0B',
          coal: '#0F0F0F',
          smoke: '#161616',
          ash: '#1E1E1E',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E6C55C',
          dim: '#A8862A',
        },
        silver: {
          DEFAULT: '#C0C0C0',
          light: '#E8E8E8',
          dim: '#8A8A8A',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        'ultra-wide': '0.35em',
        'mega': '0.5em',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'blink': 'blink 5s ease-in-out infinite',
        'tail-sway': 'tailSway 2.5s ease-in-out infinite',
        'walk': 'walk 0.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(8px)' },
          '50%': { opacity: '1', filter: 'blur(12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breathe: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.03)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '93%, 97%': { transform: 'scaleY(0.1)' },
        },
        tailSway: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        walk: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-2px) rotate(-3deg)' },
          '75%': { transform: 'translateY(-2px) rotate(3deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
