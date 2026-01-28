export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Dental Market',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu',
  locale: 'tr-TR',
  currency: 'TRY',
  contact: {
    email: 'info@dentalmarket.com',
    phone: '+90 (XXX) XXX XX XX',
  },
  social: {
    twitter: '@dentalmarket',
    facebook: 'dentalmarket',
    linkedin: 'dentalmarket',
  },
}
