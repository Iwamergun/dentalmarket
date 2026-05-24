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
