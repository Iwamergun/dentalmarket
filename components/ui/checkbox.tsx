'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 rounded border-2 border-border transition-colors',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-secondary peer-focus-visible:ring-offset-2',
            'peer-checked:bg-secondary peer-checked:border-secondary',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'flex items-center justify-center',
            className
          )}
        >
          {checked && (
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
