import { Header } from '@/components/layout/header'
import { CategoryBar } from '@/components/layout/category-bar'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <CategoryBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
