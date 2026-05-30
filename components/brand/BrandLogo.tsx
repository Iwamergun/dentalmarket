type BrandLogoVariant = 'full' | 'icon'

interface BrandLogoProps {
  variant?: BrandLogoVariant
  alt?: string
  className?: string
}

/**
 * BrandLogo — single source of truth for the DentAlışveriş logo mark.
 * When the real logo asset is ready, update this component and it will
 * automatically reflect in header, footer, admin sidebar, auth pages, etc.
 *
 * variant="icon"  — square logo mark only (used in header, sidebars)
 * variant="full"  — logo mark + brand name (used in footer, error, loading pages)
 */
export function BrandLogo({ variant = 'full', alt = 'DentAlışveriş', className = '' }: BrandLogoProps) {
  if (variant === 'icon') {
    // Icon-only: expose a11y role so screen readers and tests can find it
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex select-none items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary font-black text-sm leading-none text-white ${className}`}
      >
        D
      </span>
    )
  }

  // Full lockup: visible brand name provides the accessible label; mark is decorative
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary font-black text-sm leading-none text-white"
      >
        D
      </span>
      <span className="text-lg font-extrabold leading-none tracking-tight">
        {alt}
      </span>
    </span>
  )
}
