import { siteConfig } from '@/lib/constants/site-config'

interface OrderItem {
  product_name: string
  product_sku?: string | null
  variant_name?: string | null
  quantity: number
  unit_price: number
  total: number
}

interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  total: number
  items: OrderItem[]
  notes?: string | null
  invoiceNumber?: string | null
}

const paymentMethodLabel: Record<string, string> = {
  credit_card: 'Kredi Kartı / Banka Kartı',
  bank_transfer: 'Havale / EFT',
  cash_on_delivery: 'Kapıda Ödeme',
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount)
}

/**
 * Returns the HTML body for an order-confirmation / invoice email.
 */
export function buildOrderConfirmationEmail(data: OrderConfirmationData): {
  html: string
  text: string
} {
  const siteName = siteConfig.name
  const siteUrl = siteConfig.url
  const paymentLabel =
    paymentMethodLabel[data.paymentMethod] ?? data.paymentMethod

  const itemRows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
            <strong>${item.product_name}</strong>
            ${item.variant_name ? `<br><span style="font-size:12px;color:#6b7280;">${item.variant_name}</span>` : ''}
            ${item.product_sku ? `<br><span style="font-size:11px;color:#9ca3af;">SKU: ${item.product_sku}</span>` : ''}
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(item.unit_price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${formatCurrency(item.total)}</td>
        </tr>`
    )
    .join('')

  const invoiceNote = data.invoiceNumber
    ? `<p style="margin:0 0 8px;">Fatura No: <strong>${data.invoiceNumber}</strong></p>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Sipariş Onayı – ${data.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

          <!-- Header -->
          <tr>
            <td style="background:#0ea5e9;padding:24px 32px;">
              <h1 style="margin:0;font-size:22px;color:#ffffff;">${siteName}</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#e0f2fe;">Sipariş Onayı</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 0;">
              <h2 style="margin:0 0 8px;font-size:18px;color:#111827;">
                Siparişiniz Alındı ✔
              </h2>
              <p style="margin:0;color:#374151;">Merhaba <strong>${data.customerName}</strong>,</p>
              <p style="margin:8px 0 0;color:#374151;">
                Siparişiniz başarıyla oluşturuldu. Aşağıda sipariş detaylarınızı bulabilirsiniz.
              </p>
            </td>
          </tr>

          <!-- Order meta -->
          <tr>
            <td style="padding:20px 32px 0;">
              <table cellpadding="0" cellspacing="0" style="width:100%;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 8px;">Sipariş No: <strong>${data.orderNumber}</strong></p>
                    ${invoiceNote}
                    <p style="margin:0;">Ödeme Yöntemi: <strong>${paymentLabel}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items table -->
          <tr>
            <td style="padding:20px 32px 0;">
              <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                  <tr style="background:#f3f4f6;">
                    <th style="padding:10px 12px;text-align:left;font-weight:600;color:#374151;">Ürün</th>
                    <th style="padding:10px 12px;text-align:center;font-weight:600;color:#374151;">Adet</th>
                    <th style="padding:10px 12px;text-align:right;font-weight:600;color:#374151;">Birim Fiyat</th>
                    <th style="padding:10px 12px;text-align:right;font-weight:600;color:#374151;">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;">
                <tr>
                  <td style="text-align:right;padding:4px 0;color:#6b7280;">Ara Toplam:</td>
                  <td style="text-align:right;padding:4px 0 4px 16px;width:120px;">${formatCurrency(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="text-align:right;padding:4px 0;color:#6b7280;">Kargo:</td>
                  <td style="text-align:right;padding:4px 0 4px 16px;">${data.shippingCost === 0 ? 'Ücretsiz' : formatCurrency(data.shippingCost)}</td>
                </tr>
                <tr>
                  <td style="text-align:right;padding:8px 0 4px;font-size:16px;font-weight:700;border-top:2px solid #e5e7eb;">GENEL TOPLAM:</td>
                  <td style="text-align:right;padding:8px 0 4px 16px;font-size:16px;font-weight:700;border-top:2px solid #e5e7eb;color:#0ea5e9;">${formatCurrency(data.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            data.paymentMethod === 'bank_transfer'
              ? `<!-- Bank transfer note -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table cellpadding="0" cellspacing="0" style="width:100%;background:#fef9c3;border-radius:6px;border:1px solid #fde047;">
                <tr>
                  <td style="padding:14px 16px;font-size:13px;color:#713f12;">
                    <strong>⚠ Havale / EFT Bildirimi</strong><br/>
                    Siparişinizin işleme alınması için lütfen <strong>${formatCurrency(data.total)}</strong> tutarını
                    banka hesabımıza havale ediniz. Ödeme bilgileri ayrıca müşteri hizmetlerimiz tarafından
                    iletilecektir.
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px;" align="center">
              <a href="${siteUrl}/hesabim/siparislerim"
                 style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;
                        padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                Siparişlerimi Görüntüle
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af;">
              <p style="margin:0;">${siteName} – ${siteConfig.contact.email}</p>
              <p style="margin:4px 0 0;">Bu e-posta otomatik olarak oluşturulmuştur, lütfen yanıtlamayınız.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `${siteName} – Sipariş Onayı`,
    ``,
    `Merhaba ${data.customerName},`,
    `Siparişiniz başarıyla alındı.`,
    ``,
    `Sipariş No: ${data.orderNumber}`,
    data.invoiceNumber ? `Fatura No : ${data.invoiceNumber}` : '',
    `Ödeme    : ${paymentLabel}`,
    ``,
    `Ürünler:`,
    ...data.items.map(
      (i) =>
        `  - ${i.product_name}${i.variant_name ? ` (${i.variant_name})` : ''} x${i.quantity}  ${formatCurrency(i.total)}`
    ),
    ``,
    `Ara Toplam : ${formatCurrency(data.subtotal)}`,
    `Kargo      : ${data.shippingCost === 0 ? 'Ücretsiz' : formatCurrency(data.shippingCost)}`,
    `TOPLAM     : ${formatCurrency(data.total)}`,
    ``,
    `Siparişlerinizi takip etmek için: ${siteUrl}/hesabim/siparislerim`,
    ``,
    `${siteName} – ${siteConfig.contact.email}`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return { html, text }
}
