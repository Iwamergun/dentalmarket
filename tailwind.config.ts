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
        // Dark theme backgrounds
        background: {
          DEFAULT: 'var(--background)',
          deep: 'var(--background-deep)',
          card: 'var(--background-card)',
          elevated: 'var(--background-elevated)',
        },
        foreground: 'var(--foreground)',
        // Primary - Medical Blue
        primary: {
          DEFAULT: '#0A84FF',
          dark: '#0066CC',
          light: '#3399FF',
          glow: 'rgba(10, 132, 255, 0.4)',
        },
        // Accent - Dental Mint/Cyan
        accent: {
          DEFAULT: '#00D9C0',
          dark: '#00B3A0',
          light: '#33E6D1',
          glow: 'rgba(0, 217, 192, 0.4)',
        },
        // Text colors
        text: {
          primary: '#F0F4F8',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        // Border colors
        border: {
          DEFAULT: '#1E293B',
          light: '#334155',
          focus: '#0A84FF',
        },
        // Status colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'glow-primary': '0 0 20px rgba(10, 132, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(0, 217, 192, 0.3)',
        'glow-primary-lg': '0 0 40px rgba(10, 132, 255, 0.4)',
        'glow-accent-lg': '0 0 40px rgba(0, 217, 192, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
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
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(10, 132, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(10, 132, 255, 0.5)' },
        },
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
