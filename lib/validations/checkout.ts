import { z } from 'zod'

// Teslimat Adresi Şeması
export const addressSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: z.string()
    .regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz')
    .transform(val => val.replace(/^(\+90|0)/, '')), // Normalize phone
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir seçiniz'),
  district: z.string().min(2, 'İlçe giriniz'),
  postalCode: z.string().regex(/^[0-9]{5}$/, 'Geçerli bir posta kodu giriniz (5 haneli)'),
  notes: z.string().optional(),
})

// Ödeme Yöntemi
export const paymentMethodSchema = z.enum(['credit_card', 'bank_transfer', 'cash_on_delivery'])

// Tam Checkout Şeması
export const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: paymentMethodSchema,
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Sipariş koşullarını kabul etmelisiniz',
  }),
})

export type AddressFormData = z.infer<typeof addressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>

// Türkiye Şehirleri
export const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
  'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

// Ödeme Yöntemleri
export const paymentMethods = [
  {
    id: 'credit_card' as const,
    name: 'Kredi Kartı / Banka Kartı',
    description: '3D Secure ile güvenli ödeme',
    icon: 'CreditCard',
  },
  {
    id: 'bank_transfer' as const,
    name: 'Havale / EFT',
    description: 'Banka hesabımıza havale yapın',
    icon: 'Building',
  },
  {
    id: 'cash_on_delivery' as const,
    name: 'Kapıda Ödeme',
    description: 'Teslimat sırasında nakit veya kart ile ödeme',
    icon: 'Truck',
  },
]
