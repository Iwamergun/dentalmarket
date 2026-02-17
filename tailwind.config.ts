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
        // Light theme backgrounds
        background: {
          DEFAULT: 'var(--background)',
          deep: 'var(--background-deep)',
          card: 'var(--background-card)',
          elevated: 'var(--background-elevated)',
        },
        foreground: 'var(--foreground)',
        // Primary - Rich Dark Blue (Amazon-inspired)
        primary: {
          DEFAULT: '#131921',
          dark: '#0A0E14',
          light: '#232F3E',
        },
        // Secondary - Electric Blue
        secondary: {
          DEFAULT: '#146EB4',
          dark: '#0F5A8F',
          light: '#1E88E5',
        },
        // Accent - Vibrant Orange (Amazon-inspired)
        accent: {
          DEFAULT: '#FF9900',
          dark: '#F57C00',
          light: '#FFB84D',
        },
        // Purple Accent for Premium
        purple: {
          DEFAULT: '#9C27B0',
          dark: '#7B1FA2',
          light: '#BA68C8',
        },
        // Teal Accent
        teal: {
          DEFAULT: '#00ACC1',
          dark: '#00838F',
          light: '#26C6DA',
        },
        // Text colors
        text: {
          primary: '#0F172A',
          secondary: '#565959',
          muted: '#8B949E',
        },
        // Border colors
        border: {
          DEFAULT: '#D5D9D9',
          light: '#E7E7E7',
          focus: '#FF9900',
        },
        // Status colors
        success: '#00C853',
        warning: '#FF9900',
        error: '#EF4444',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 16px rgba(255, 153, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'premium': '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'glow-accent': '0 6px 16px rgba(255, 153, 0, 0.4)',
        'glow-purple': '0 6px 16px rgba(156, 39, 176, 0.4)',
        'glow-teal': '0 6px 16px rgba(0, 172, 193, 0.4)',
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
