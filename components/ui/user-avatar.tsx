import Image from 'next/image'
import { CircleUserRound } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  className?: string
  iconClassName?: string
}

export function UserAvatar({ src, name, className, iconClassName }: UserAvatarProps) {
  const hasImage = typeof src === 'string' && src.trim().length > 0

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm',
        className
      )}
    >
      {hasImage ? (
        <Image
          src={src.trim()}
          alt={name ? `${name} profil fotoğrafı` : 'Profil fotoğrafı'}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <CircleUserRound className={cn('h-5 w-5', iconClassName)} aria-hidden="true" />
      )}
    </div>
  )
}
