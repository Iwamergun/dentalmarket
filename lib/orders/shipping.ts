type ShippingOffer = {
  supplier_id: string
  shipping_cost: number | null
  free_shipping_threshold: number | null
}

type ShippingItem = {
  offer: ShippingOffer
  quantity: number
  unitPrice: number
}

export function calculateShippingCost(items: ShippingItem[]) {
  const supplierTotals = new Map<string, { subtotal: number; shippingCost: number; freeThreshold: number | null }>()

  for (const item of items) {
    const current = supplierTotals.get(item.offer.supplier_id) ?? {
      subtotal: 0,
      shippingCost: Number(item.offer.shipping_cost ?? 0),
      freeThreshold: item.offer.free_shipping_threshold ?? null,
    }

    current.subtotal += item.unitPrice * item.quantity
    supplierTotals.set(item.offer.supplier_id, current)
  }

  let totalShipping = 0
  supplierTotals.forEach((supplier) => {
    const threshold = supplier.freeThreshold
    const qualifiesForFreeShipping = threshold !== null && threshold > 0 && supplier.subtotal >= threshold

    if (!qualifiesForFreeShipping) {
      totalShipping += supplier.shippingCost
    }
  })

  return Number(totalShipping.toFixed(2))
}
