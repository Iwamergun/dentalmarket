'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <style>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .tooth-wobble { animation: wobble 1.8s ease-in-out infinite; }
      `}</style>

      {/* Brand Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
          <span className="text-lg font-bold text-white">DA</span>
        </div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Dent Alışveriş
        </span>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border bg-background-card p-8 text-center shadow-lg">
        {/* Cracked Tooth Icon */}
        <div className="mb-6 flex justify-center">
          <div className="tooth-wobble flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-14 w-14">
              <path
                d="M32 6C24 6 20 10 18 14C16 18 14 22 16 30C18 38 20 46 22 54C24 60 26 62 28 62C30 62 31 58 32 54C33 58 34 62 36 62C38 62 40 60 42 54C44 46 46 38 48 30C50 22 48 18 46 14C44 10 40 6 32 6Z"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Crack lines */}
              <path
                d="M30 14 L33 22 L29 28 L32 36"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-text-primary">
          Bir Hata Oluştu
        </h1>
        <p className="mb-6 text-text-secondary">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'Beklenmeyen bir sorunla karşılaşıldı. Lütfen tekrar deneyin.'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-background"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
