export type SupplierOrderNotificationItem = {
  supplierId: string | null
  productName: string
  quantity: number
}

export type SupplierOrderNotificationInsert = {
  user_id: string
  type: 'supplier_new_order'
  title: string
  body: string
  action_url: string
  dedupe_key: string
  metadata: {
    orderId: string
    orderNumber: string
    clinicName: string
    supplierId: string
    productCount: number
  }
}

function buildItemSummary(items: SupplierOrderNotificationItem[]) {
  const summary = items
    .slice(0, 2)
    .map((item) => `${item.productName} x${item.quantity}`)
    .join(', ')

  if (items.length <= 2) {
    return summary
  }

  return `${summary} +${items.length - 2} ürün daha`
}

export function resolveClinicNotificationName(params: {
  companyName?: string | null
  shippingFullName?: string | null
}) {
  return params.companyName?.trim() || params.shippingFullName?.trim() || 'Bir klinik'
}

export function buildSupplierOrderNotifications(params: {
  orderId: string
  orderNumber: string
  clinicName: string
  items: SupplierOrderNotificationItem[]
}): SupplierOrderNotificationInsert[] {
  const itemsBySupplier = new Map<string, SupplierOrderNotificationItem[]>()

  for (const item of params.items) {
    if (!item.supplierId) {
      continue
    }

    const existingItems = itemsBySupplier.get(item.supplierId) ?? []
    existingItems.push(item)
    itemsBySupplier.set(item.supplierId, existingItems)
  }

  return Array.from(itemsBySupplier.entries()).map(([supplierId, items]) => ({
    user_id: supplierId,
    type: 'supplier_new_order',
    title: 'Yeni sipariş aldınız',
    body: `Sipariş #${params.orderNumber} • ${params.clinicName}${items.length > 0 ? ` • ${buildItemSummary(items)}` : ''}`,
    action_url: `/supplier/siparisler?orderNumber=${encodeURIComponent(params.orderNumber)}`,
    dedupe_key: `supplier-new-order:${params.orderId}:${supplierId}`,
    metadata: {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      clinicName: params.clinicName,
      supplierId,
      productCount: items.length,
    },
  }))
}
