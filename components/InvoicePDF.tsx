import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Helper functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount: number | string): string => {
  return `₺${parseFloat(String(amount)).toFixed(2)}`
}

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    width: 120,
    fontSize: 9,
    color: '#666',
  },
  value: {
    fontSize: 9,
    color: '#333',
    flex: 1,
  },
  table: {
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    fontSize: 9,
  },
  tableCellSku: {
    fontSize: 8,
    color: '#666',
  },
  colProduct: { width: '40%' },
  colUnitPrice: { width: '15%', textAlign: 'right' },
  colQuantity: { width: '15%', textAlign: 'right' },
  colTax: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  totals: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    width: 250,
  },
  totalLabel: {
    fontSize: 10,
    color: '#666',
    width: 130,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    fontSize: 10,
    color: '#333',
    width: 120,
    textAlign: 'right',
  },
  totalValueGreen: {
    fontSize: 10,
    color: '#16a34a',
    width: 120,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: '#333',
    width: 250,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    width: 130,
    textAlign: 'right',
    paddingRight: 10,
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    width: 120,
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
})

interface InvoicePDFProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoice: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
}

const InvoicePDF = ({ invoice, order, items }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.companyName}>DentalMarket</Text>
          <Text style={styles.companyInfo}>Ornek Mahallesi, Ornek Cd. No:123, Istanbul</Text>
          <Text style={styles.companyInfo}>Tel: +90 (212) 123 45 67 | Email: info@dentalmarket.com</Text>
          <Text style={styles.companyInfo}>Vergi Dairesi: Kadikoy | Vergi No: 1234567890</Text>
        </View>
        <View>
          <Text style={styles.invoiceTitle}>FATURA</Text>
        </View>
      </View>

      {/* 2. Fatura Bilgileri */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Fatura No:</Text>
          <Text style={styles.value}>{invoice.invoice_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Siparis No:</Text>
          <Text style={styles.value}>{order.order_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fatura Tarihi:</Text>
          <Text style={styles.value}>{formatDate(invoice.invoice_date)}</Text>
        </View>
      </View>

      {/* 3. Müşteri Bilgileri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MUSTERI BILGILERI</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Ad / Sirket Adi:</Text>
          <Text style={styles.value}>{invoice.customer_name}</Text>
        </View>
        {order.billing_type === 'corporate' && invoice.customer_tax_office && (
          <View style={styles.row}>
            <Text style={styles.label}>Vergi Dairesi:</Text>
            <Text style={styles.value}>{invoice.customer_tax_office}</Text>
          </View>
        )}
        {order.billing_type === 'corporate' && invoice.customer_tax_number && (
          <View style={styles.row}>
            <Text style={styles.label}>Vergi No:</Text>
            <Text style={styles.value}>{invoice.customer_tax_number}</Text>
          </View>
        )}
        {(invoice.customer_address || invoice.customer_city) && (
          <View style={styles.row}>
            <Text style={styles.label}>Adres:</Text>
            <Text style={styles.value}>
              {[invoice.customer_address, invoice.customer_city].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
        {invoice.customer_phone && (
          <View style={styles.row}>
            <Text style={styles.label}>Telefon:</Text>
            <Text style={styles.value}>{invoice.customer_phone}</Text>
          </View>
        )}
        {invoice.customer_email && (
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{invoice.customer_email}</Text>
          </View>
        )}
      </View>

      {/* 4. Ürün Tablosu */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colProduct]}>Urun</Text>
          <Text style={[styles.tableHeaderText, styles.colUnitPrice]}>Birim Fiyat</Text>
          <Text style={[styles.tableHeaderText, styles.colQuantity]}>Miktar</Text>
          <Text style={[styles.tableHeaderText, styles.colTax]}>KDV (%)</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Toplam</Text>
        </View>

        {/* Table Rows */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.map((item: any, index: number) => (
          <View key={item.id || index} style={styles.tableRow}>
            <View style={styles.colProduct}>
              <Text style={styles.tableCell}>
                {item.product_name}
                {item.variant_name ? ` - ${item.variant_name}` : ''}
              </Text>
              {item.product_sku && (
                <Text style={styles.tableCellSku}>SKU: {item.product_sku}</Text>
              )}
            </View>
            <Text style={[styles.tableCell, styles.colUnitPrice]}>
              {formatCurrency(item.unit_price)}
            </Text>
            <Text style={[styles.tableCell, styles.colQuantity]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, styles.colTax]}>
              {item.tax_rate}%
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              {formatCurrency(item.total)}
            </Text>
          </View>
        ))}
      </View>

      {/* 5. Toplam Hesaplamalar */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Ara Toplam:</Text>
          <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
        </View>
        {invoice.discount_amount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Indirim:</Text>
            <Text style={styles.totalValueGreen}>-{formatCurrency(invoice.discount_amount)}</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Kargo:</Text>
          <Text style={styles.totalValue}>
            {invoice.shipping_cost === 0 ? 'Ucretsiz' : formatCurrency(invoice.shipping_cost)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>KDV:</Text>
          <Text style={styles.totalValue}>{formatCurrency(invoice.tax_amount)}</Text>
        </View>
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>GENEL TOPLAM:</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total_amount)}</Text>
        </View>
      </View>

      {/* 6. Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bu fatura elektronik olarak olusturulmustur.</Text>
        <Text style={styles.footerText}>DentalMarket - Dental Malzeme ve Ekipman Tedariki</Text>
        <Text style={styles.footerText}>www.dentalmarket.com</Text>
      </View>
    </Page>
  </Document>
)

export default InvoicePDF
