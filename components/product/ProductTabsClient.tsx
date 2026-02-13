'use client'

import { useState } from 'react'
import { FileText, List, Truck } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ProductTabsClientProps {
  description: string | null
}

type TabKey = 'description' | 'specs' | 'shipping'

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'description', label: 'Açıklama', icon: FileText },
  { key: 'specs', label: 'Özellikler', icon: List },
  { key: 'shipping', label: 'Kargo & İade', icon: Truck },
]

export function ProductTabsClient({ description }: ProductTabsClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('description')

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      {/* Tab Başlıkları */}
      <div className="flex border-b border-border/50 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab İçerikleri */}
      <div className="p-6">
        {/* Açıklama */}
        {activeTab === 'description' && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {description ? (
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {description}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                Bu ürün için henüz detaylı açıklama eklenmemiştir.
              </p>
            )}
          </div>
        )}

        {/* Özellikler */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <p className="text-muted-foreground italic">
              Bu ürüne ait teknik özellikler yakında eklenecektir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between py-3 px-4 bg-muted/30 rounded-lg">
                <span className="font-medium text-foreground">Kategori</span>
                <span className="text-muted-foreground">Dental Ürün</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-muted/30 rounded-lg">
                <span className="font-medium text-foreground">Menşei</span>
                <span className="text-muted-foreground">—</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-muted/30 rounded-lg">
                <span className="font-medium text-foreground">Garanti</span>
                <span className="text-muted-foreground">Üretici garantisi</span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-muted/30 rounded-lg">
                <span className="font-medium text-foreground">Ambalaj</span>
                <span className="text-muted-foreground">Orijinal kutu</span>
              </div>
            </div>
          </div>
        )}

        {/* Kargo & İade */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Kargo Bilgileri</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Siparişleriniz 1-3 iş günü içinde kargoya verilir.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  500 TL üzeri siparişlerde kargo ücretsizdir.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Anlaşmalı kargo firmaları ile güvenli teslimat yapılmaktadır.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Kargo takip numaranız e-posta ile gönderilir.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">İade Koşulları</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Ürünler teslim tarihinden itibaren 14 gün içinde iade edilebilir.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  İade edilecek ürünler kullanılmamış ve orijinal ambalajında olmalıdır.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  İade işlemleri için müşteri hizmetlerimizle iletişime geçin.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
