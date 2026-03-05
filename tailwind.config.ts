import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1419',
          elevated: '#1a2332',
          muted: '#16202d',
        },
        accent: {
          DEFAULT: '#00d4aa',
          hover: '#00b894',
          muted: 'rgba(0, 212, 170, 0.15)',
        },
        border: {
          DEFAULT: '#2d3a4d',
          focus: '#00d4aa',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        glow: '0 0 20px rgba(0, 212, 170, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
