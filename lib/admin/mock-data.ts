export interface AdminListRow {
  id: string
  values: string[]
}

export interface AdminListSection {
  title: string
  description: string
  columns: string[]
  rows: AdminListRow[]
  apiTodo: string
}

export const customersSection: AdminListSection = {
  title: 'Müşteriler',
  description: 'Admin müşteri görünümü (geçici mock veri).',
  columns: ['Firma', 'E-posta', 'Telefon', 'Durum'],
  rows: [
    { id: 'cust-1', values: ['Klinik Ağız Sağlığı', 'satinalma@klinika.com', '+90 216 000 00 01', 'Aktif'] },
    { id: 'cust-2', values: ['Dentpro İstanbul', 'ofis@dentpro.com', '+90 212 000 00 02', 'Beklemede'] },
    { id: 'cust-3', values: ['Diş Plus Ankara', 'info@displus.com', '+90 312 000 00 03', 'Aktif'] },
  ],
  apiTodo: 'TODO: Gerçek müşteri verisini /api/admin/customers endpointinden bağla.',
}

export const categoriesSection: AdminListSection = {
  title: 'Kategoriler',
  description: 'Admin kategori görünümü (geçici mock veri).',
  columns: ['Kategori', 'Slug', 'Aktif Ürün', 'Durum'],
  rows: [
    { id: 'cat-1', values: ['İmplant', 'implant', '42', 'Yayında'] },
    { id: 'cat-2', values: ['Dolgu Materyalleri', 'dolgu-materyalleri', '27', 'Yayında'] },
    { id: 'cat-3', values: ['Sterilizasyon', 'sterilizasyon', '18', 'Taslak'] },
  ],
  apiTodo: 'TODO: Gerçek kategori verisini /api/admin/categories endpointinden bağla.',
}

export const brandsSection: AdminListSection = {
  title: 'Markalar',
  description: 'Admin marka görünümü (geçici mock veri).',
  columns: ['Marka', 'Ülke', 'Ürün Sayısı', 'Durum'],
  rows: [
    { id: 'brand-1', values: ['Dentex', 'Türkiye', '54', 'Aktif'] },
    { id: 'brand-2', values: ['OralMax', 'Almanya', '31', 'Aktif'] },
    { id: 'brand-3', values: ['BioSmile', 'İtalya', '12', 'Pasif'] },
  ],
  apiTodo: 'TODO: Gerçek marka verisini /api/admin/brands endpointinden bağla.',
}

export const reportsSection: AdminListSection = {
  title: 'Raporlar',
  description: 'Admin rapor kartları (geçici mock veri).',
  columns: ['Rapor', 'Aralık', 'Son Güncelleme', 'Durum'],
  rows: [
    { id: 'rep-1', values: ['Satış Özeti', 'Son 30 Gün', 'Bugün 10:15', 'Hazır'] },
    { id: 'rep-2', values: ['Stok Risk Raporu', 'Haftalık', 'Bugün 08:40', 'Hazır'] },
    { id: 'rep-3', values: ['Müşteri Segmentasyonu', 'Aylık', 'Dün 17:20', 'İşleniyor'] },
  ],
  apiTodo: 'TODO: Rapor verilerini /api/admin/reports endpointlerinden getir.',
}

export const settingsSection: AdminListSection = {
  title: 'Ayarlar',
  description: 'Admin panel ayarları (geçici mock veri).',
  columns: ['Ayar', 'Değer', 'Son Güncelleme', 'Durum'],
  rows: [
    { id: 'set-1', values: ['Sipariş E-posta Bildirimi', 'Açık', 'Bugün 09:05', 'Aktif'] },
    { id: 'set-2', values: ['Düşük Stok Eşiği', '10', 'Dün 15:12', 'Aktif'] },
    { id: 'set-3', values: ['Bakım Modu', 'Kapalı', '3 gün önce', 'Pasif'] },
  ],
  apiTodo: 'TODO: Ayarları /api/admin/settings endpointi ile kalıcı hale getir.',
}
