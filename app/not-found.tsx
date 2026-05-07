import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <style>{`
        @keyframes bounce-tooth {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .tooth-bounce { animation: bounce-tooth 2s ease-in-out infinite; }
      `}</style>

      {/* Brand Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
          <span className="text-lg font-bold text-white">DA</span>
        </div>
        <span className="text-xl font-extrabold text-primary">
          Dent Alışveriş
        </span>
      </div>

      <div className="w-full max-w-lg rounded-2xl border border-border bg-background-card p-8 text-center shadow-lg">
        {/* Tooth with question mark */}
        <div className="mb-6 flex justify-center">
          <div className="tooth-bounce flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-14 w-14">
              <path
                d="M32 6C24 6 20 10 18 14C16 18 14 22 16 30C18 38 20 46 22 54C24 60 26 62 28 62C30 62 31 58 32 54C33 58 34 62 36 62C38 62 40 60 42 54C44 46 46 38 48 30C50 22 48 18 46 14C44 10 40 6 32 6Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              {/* Question mark */}
              <text x="27" y="38" fontSize="16" fontWeight="bold" className="text-primary" style={{ fill: 'var(--color-primary, #0ea5e9)' }}>?</text>
            </svg>
          </div>
        </div>

        {/* 404 */}
        <p className="mb-2 text-7xl font-extrabold text-primary">
          404
        </p>
        <h1 className="mb-2 text-2xl font-bold text-text-primary">
          Sayfa Bulunamadı
        </h1>
        <p className="mb-8 text-text-secondary">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-background"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ürünlere Göz At
          </Link>
        </div>
      </div>
    </div>
  )
}
