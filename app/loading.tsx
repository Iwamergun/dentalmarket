export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Brand Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md">
          <span className="text-sm font-bold text-white">DA</span>
        </div>
        <span className="text-lg font-extrabold text-primary">
          Dent Alışveriş
        </span>
      </div>

      {/* Tooth with spinner ring */}
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-border border-t-primary" />
        {/* Pulsing tooth icon */}
        <div className="animate-pulse">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
            <path
              d="M32 6C24 6 20 10 18 14C16 18 14 22 16 30C18 38 20 46 22 54C24 60 26 62 28 62C30 62 31 58 32 54C33 58 34 62 36 62C38 62 40 60 42 54C44 46 46 38 48 30C50 22 48 18 46 14C44 10 40 6 32 6Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          </svg>
        </div>
      </div>

      <p className="mt-8 text-sm font-medium text-text-secondary">Yükleniyor...</p>
    </div>
  )
}
