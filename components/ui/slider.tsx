'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  min?: number
  max?: number
  step?: number
  value?: number
  onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value = 0, onValueChange, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className="relative w-full">
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            'bg-border',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-secondary',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-colors',
            '[&::-webkit-slider-thumb]:hover:bg-secondary-dark',
            '[&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-secondary',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:transition-colors',
            '[&::-moz-range-thumb]:hover:bg-secondary-dark',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
            className
          )}
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
          {...props}
        />
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }
