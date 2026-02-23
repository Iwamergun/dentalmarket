import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SPARK OKLCH Color System — opacity-compatible
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: 'oklch(var(--card) / <alpha-value>)',
        primary: 'oklch(var(--primary) / <alpha-value>)',
        secondary: 'oklch(var(--secondary) / <alpha-value>)',
        accent: 'oklch(var(--accent) / <alpha-value>)',
        destructive: 'oklch(var(--destructive) / <alpha-value>)',
        muted: 'oklch(var(--muted) / <alpha-value>)',
        border: 'oklch(var(--border) / <alpha-value>)',
        success: 'oklch(var(--success) / <alpha-value>)',
        warning: 'oklch(var(--warning) / <alpha-value>)',
        info: 'oklch(var(--info) / <alpha-value>)',
        'body-text': 'oklch(var(--body-text) / <alpha-value>)',
        'secondary-text': 'oklch(var(--secondary-text) / <alpha-value>)',
        'gradient-start': 'oklch(var(--gradient-start) / <alpha-value>)',
        'gradient-end': 'oklch(var(--gradient-end) / <alpha-value>)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
