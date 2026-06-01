import { Header } from '@/components/layout/header'
import { CategoryBar } from '@/components/layout/category-bar'
import { Footer } from '@/components/layout/footer'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <CategoryBar />
      <main className="min-h-screen pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
