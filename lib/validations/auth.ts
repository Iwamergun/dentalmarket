import { z } from 'zod'

const TR_TAX_NUMBER_REGEX = /^[0-9]{10}$/
const TR_PHONE_REGEX = /^(\+90|0)?[0-9]{10}$/

// Login şeması
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z.string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalıdır'),
})

// Register şeması
export const registerSchema = z.object({
  role: z.enum(['clinic', 'depo'], {
    errorMap: () => ({ message: 'Lütfen bir hesap türü seçin' }),
  }),
  company_name: z.string().trim(),
  tax_number: z.string().trim().optional(),
  phone: z.string().trim(),
  store_description: z.string().trim().max(500, 'Mağaza açıklaması en fazla 500 karakter olabilir').optional(),
  firstName: z.string()
    .min(1, 'Ad gerekli')
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  lastName: z.string()
    .min(1, 'Soyad gerekli')
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir'),
  email: z.string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z.string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
  confirmPassword: z.string()
    .min(1, 'Şifre tekrarı gerekli'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Şifreler eşleşmiyor',
      path: ['confirmPassword'],
    })
  }

  const phoneValid = TR_PHONE_REGEX.test(data.phone)

  if (!data.company_name || data.company_name.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Firma adı en az 2 karakter olmalıdır',
      path: ['company_name'],
    })
  }

  if (!data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Telefon numarası gerekli',
      path: ['phone'],
    })
  } else if (!phoneValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Geçerli bir telefon numarası giriniz',
      path: ['phone'],
    })
  }

  if (data.tax_number && !TR_TAX_NUMBER_REGEX.test(data.tax_number)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vergi numarası 10 haneli ve sadece rakamlardan oluşmalıdır',
      path: ['tax_number'],
    })
  }

  if (data.role === 'depo' && !data.tax_number) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vergi numarası gerekli',
      path: ['tax_number'],
    })
  }
})

// Şifre sıfırlama şeması
export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi giriniz'),
})

// Tipler
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
