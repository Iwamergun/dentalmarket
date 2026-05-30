import Image from 'next/image'

type BrandLogoVariant = 'full' | 'icon'

interface BrandLogoProps {
  variant?: BrandLogoVariant
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
}

const brandLogoSources: Record<BrandLogoVariant, { src: string; width: number; height: number }> = {
  full: {
    src: '/brand/dentalisveris-logo.svg',
    width: 960,
    height: 240,
  },
  icon: {
    src: '/brand/dentalisveris-icon.svg',
    width: 512,
    height: 512,
  },
}

export function BrandLogo({
  variant = 'full',
  alt = 'DentAlışveriş',
  className,
  ...props
}: BrandLogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        role="img"
        aria-label={alt}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4.5C18.532 4.5 13.818 6.661 10.943 10.605C8.505 13.95 7.923 18.252 9.254 23.045L12.848 35.997C13.742 39.221 15.447 42.5 18.666 42.5C21.405 42.5 22.49 40.317 23.322 37.109L23.855 35.051C23.948 34.694 24.052 34.694 24.145 35.051L24.678 37.109C25.51 40.317 26.595 42.5 29.334 42.5C32.553 42.5 34.258 39.221 35.152 35.997L38.746 23.045C40.077 18.252 39.495 13.95 37.057 10.605C34.182 6.661 29.468 4.5 24 4.5Z"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 16.5C19.25 14.407 21.553 13.36 24 13.36C26.447 13.36 28.75 14.407 30.5 16.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 16.25V26.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M20 22.25L24 26.5L28 22.25"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const logo = brandLogoSources[variant]

  return (
    <Image
      src={logo.src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      className={className}
      {...props}
    />
  )
}
