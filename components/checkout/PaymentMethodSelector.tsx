'use client'

import { CreditCard, Building, Truck, Check } from 'lucide-react'
import { paymentMethods, type PaymentMethod } from '@/lib/validations/checkout'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null
  onSelect: (method: PaymentMethod) => void
  disabled?: boolean
}

const iconMap = {
  CreditCard,
  Building,
  Truck,
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onSelect, 
  disabled 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const Icon = iconMap[method.icon as keyof typeof iconMap] || CreditCard
        const isSelected = selectedMethod === method.id
        
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            disabled={disabled}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`p-3 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-muted'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{method.name}</p>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </div>
            {isSelected && (
              <div className="p-1 bg-primary rounded-full">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
