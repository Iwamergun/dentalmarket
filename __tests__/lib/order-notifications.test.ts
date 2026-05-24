import { describe, expect, it } from 'vitest'
import {
  buildSupplierOrderNotifications,
  resolveClinicNotificationName,
} from '@/lib/notifications/order-notifications'

describe('order notifications', () => {
  it('yalnızca ilgili tedarikçiler için bildirim üretmeli', () => {
    const notifications = buildSupplierOrderNotifications({
      orderId: 'order-1',
      orderNumber: 'DA-ORDER-1',
      clinicName: 'Örnek Klinik',
      items: [
        { supplierId: 'supplier-1', productName: 'Ürün A', quantity: 2 },
        { supplierId: 'supplier-1', productName: 'Ürün B', quantity: 1 },
        { supplierId: 'supplier-2', productName: 'Ürün C', quantity: 4 },
        { supplierId: null, productName: 'Ürün D', quantity: 1 },
      ],
    })

    expect(notifications).toHaveLength(2)
    expect(notifications.map((notification) => notification.user_id)).toEqual([
      'supplier-1',
      'supplier-2',
    ])
    expect(notifications[0]?.body).toContain('Ürün A x2')
    expect(notifications[0]?.body).toContain('Ürün B x1')
    expect(notifications[1]?.body).toContain('Ürün C x4')
  })

  it('idempotent dedupe key üretmeli', () => {
    const [notification] = buildSupplierOrderNotifications({
      orderId: 'order-42',
      orderNumber: 'DA-42',
      clinicName: 'Klinik',
      items: [{ supplierId: 'supplier-9', productName: 'Ürün', quantity: 1 }],
    })

    expect(notification?.dedupe_key).toBe('supplier-new-order:order-42:supplier-9')
    expect(notification?.action_url).toBe('/supplier/siparisler?orderNumber=DA-42')
  })

  it('klinik adı için firma adını yoksa teslimat adını kullanmalı', () => {
    expect(resolveClinicNotificationName({
      companyName: 'Dent Klinik',
      shippingFullName: 'Ayşe Kaya',
    })).toBe('Dent Klinik')

    expect(resolveClinicNotificationName({
      companyName: '',
      shippingFullName: 'Ayşe Kaya',
    })).toBe('Ayşe Kaya')
  })
})
