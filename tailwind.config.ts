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
        // Primary - Dark Navy
        primary: {
          DEFAULT: '#0F172A',
          dark: '#020617',
          light: '#1E293B',
        },
        // Secondary - Blue
        secondary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        // Accent - CTA Amber
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBB040',
        },
        // Text colors
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        // Border colors
        border: {
          DEFAULT: '#E2E8F0',
          light: '#CBD5E1',
          focus: '#2563EB',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
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
