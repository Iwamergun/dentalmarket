import { z } from 'zod'

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
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
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
