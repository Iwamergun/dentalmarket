import Link from 'next/link'
import { Navigation } from './navigation'

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Dental Market
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  )
}
