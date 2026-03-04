export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Dent Alışveriş',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu',
  locale: 'tr-TR',
  currency: 'TRY',
  contact: {
    email: 'info@dentalisveris.com',
    phone: '+90 (XXX) XXX XX XX',
  },
  social: {
    twitter: '@dentalisveris',
    facebook: 'dentalisveris',
    linkedin: 'dentalisveris',
  },
}
