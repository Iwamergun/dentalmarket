import Link from 'next/link'
import { Search, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-8 w-8 text-primary" />
          </div>
        </div>

        <p className="mb-2 text-6xl font-bold text-primary">404</p>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Sayfa Bulunamadı
        </h1>
        <p className="mb-8 text-secondary-text">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-body-text transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-4 w-4" />
            Ürünlere Göz At
          </Link>
        </div>
      </div>
    </div>
  )
}
