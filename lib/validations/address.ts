import { z } from 'zod'

// Adres formu Zod şeması
export const addressFormSchema = z.object({
  address_title: z
    .string()
    .min(1, 'Adres başlığı zorunludur')
    .max(50, 'Adres başlığı en fazla 50 karakter olabilir'),
  full_name: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  phone_number: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz (örn: 05XX XXX XX XX)'),
  address_line1: z
    .string()
    .min(5, 'Adres en az 5 karakter olmalıdır'),
  address_line2: z
    .string()
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, 'Şehir seçiniz'),
  state: z
    .string()
    .optional()
    .or(z.literal('')),
  postal_code: z
    .string()
    .regex(/^[0-9]{5}$/, 'Geçerli bir posta kodu giriniz (5 haneli)'),
  country: z
    .string()
    .default('Türkiye'),
  is_default: z
    .boolean()
    .optional()
    .default(false),
})

export type AddressFormData = z.infer<typeof addressFormSchema>

// API'den dönen adres tipi (DB sütun isimleri)
export interface Address {
  id: string
  user_id: string
  title: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  is_default: boolean
  is_billing: boolean
  created_at: string
  updated_at: string
}
