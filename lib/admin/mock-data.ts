export interface AdminCustomerMock {
  id: string
  companyName: string
  email: string
  totalOrders: number
  lastOrderDate: string
}

export interface AdminCategoryMock {
  id: string
  name: string
  productCount: number
}

export interface AdminBrandMock {
  id: string
  name: string
  productCount: number
}

// TODO: Replace with real admin customers API when backend endpoint is available.
export const adminCustomersMock: AdminCustomerMock[] = [
  {
    id: 'c-1',
    companyName: 'Örnek Klinik A.Ş.',
    email: 'info@ornekklinik.com',
    totalOrders: 18,
    lastOrderDate: '2026-05-01',
  },
  {
    id: 'c-2',
    companyName: 'Denta Plus',
    email: 'satinalma@dentaplus.com',
    totalOrders: 7,
    lastOrderDate: '2026-04-28',
  },
]

// TODO: Replace with real admin categories API when backend endpoint is available.
export const adminCategoriesMock: AdminCategoryMock[] = [
  { id: 'cat-1', name: 'Dolgu Materyalleri', productCount: 124 },
  { id: 'cat-2', name: 'Sterilizasyon', productCount: 56 },
  { id: 'cat-3', name: 'Endodonti', productCount: 88 },
]

// TODO: Replace with real admin brands API when backend endpoint is available.
export const adminBrandsMock: AdminBrandMock[] = [
  { id: 'b-1', name: '3M', productCount: 42 },
  { id: 'b-2', name: 'Ivoclar', productCount: 31 },
  { id: 'b-3', name: 'Dentsply Sirona', productCount: 27 },
]
