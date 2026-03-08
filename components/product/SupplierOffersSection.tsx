'use client'

import { useState } from 'react'
import { Store, ChevronDown, ChevronUp } from 'lucide-react'
import { SupplierOfferCard } from './SupplierOfferCard'
import type { ProductOffer } from '@/lib/supabase/queries/products'

interface SupplierOffersSectionProps {
  offers: ProductOffer[]
  productId: string
  productName: string
}

export function SupplierOffersSection({ offers, productId, productName }: SupplierOffersSectionProps) {
  const [showOthers, setShowOthers] = useState(false)

  if (offers.length === 0) return null

  const bestOffer = offers[0]
  const otherOffers = offers.slice(1)
  const hasOthers = otherOffers.length > 0

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Satıcılar <span className="text-muted-foreground font-normal text-base">({offers.length} teklif)</span>
        </h2>
      </div>

      <div className="space-y-3">
        {/* Best offer — always visible */}
        <SupplierOfferCard
          offer={bestOffer}
          productId={productId}
          productName={productName}
          isBest
        />

        {/* Toggle button for other offers */}
        {hasOthers && (
          <button
            type="button"
            onClick={() => setShowOthers((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors py-2 px-1"
          >
            📦 Diğer {otherOffers.length} satıcıyı gör
            {showOthers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}

        {/* Other offers — collapsible */}
        {hasOthers && showOthers && (
          <div className="space-y-3">
            {otherOffers.map((offer) => (
              <SupplierOfferCard
                key={offer.offer_id}
                offer={offer}
                productId={productId}
                productName={productName}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
