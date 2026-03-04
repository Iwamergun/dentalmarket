'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
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
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Bir Hata Oluştu
        </h1>
        <p className="mb-6 text-secondary-text">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'Beklenmeyen bir sorunla karşılaşıldı. Lütfen tekrar deneyin.'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-body-text transition-colors hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
