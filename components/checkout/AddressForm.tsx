'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { addressSchema, type AddressFormData, turkishCities } from '@/lib/validations/checkout'
import { User, Phone, Mail, MapPin, Building2, Hash, FileText } from 'lucide-react'

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void
  defaultValues?: Partial<AddressFormData>
  disabled?: boolean
}

export function AddressForm({ onSubmit, defaultValues, disabled }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      district: '',
      postalCode: '',
      notes: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Ad Soyad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Ad <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('firstName')}
            placeholder="Adınız"
            disabled={disabled}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Soyad <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('lastName')}
            placeholder="Soyadınız"
            disabled={disabled}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Telefon ve E-posta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Telefon <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('phone')}
            placeholder="05XX XXX XX XX"
            disabled={disabled}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            E-posta <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="ornek@email.com"
            disabled={disabled}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Adres */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Adres <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('address')}
          placeholder="Mahalle, sokak, bina no, daire no..."
          disabled={disabled}
          rows={3}
          className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.address ? 'border-red-500' : ''
          }`}
        />
        {errors.address && (
          <p className="text-xs text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Şehir, İlçe, Posta Kodu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Şehir <span className="text-red-500">*</span>
          </label>
          <select
            {...register('city')}
            disabled={disabled}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.city ? 'border-red-500' : ''
            }`}
          >
            <option value="">Şehir seçiniz</option>
            {turkishCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            İlçe <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('district')}
            placeholder="İlçe"
            disabled={disabled}
            className={errors.district ? 'border-red-500' : ''}
          />
          {errors.district && (
            <p className="text-xs text-red-500">{errors.district.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            Posta Kodu <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('postalCode')}
            placeholder="34000"
            maxLength={5}
            disabled={disabled}
            className={errors.postalCode ? 'border-red-500' : ''}
          />
          {errors.postalCode && (
            <p className="text-xs text-red-500">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      {/* Sipariş Notu */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Sipariş Notu (Opsiyonel)
        </label>
        <textarea
          {...register('notes')}
          placeholder="Teslimat ile ilgili notlarınız..."
          disabled={disabled}
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </form>
  )
}
