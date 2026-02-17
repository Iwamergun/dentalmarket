'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
  side?: 'left' | 'right' | 'top' | 'bottom'
}

interface SheetTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ children, asChild }: SheetTriggerProps) {
  const { onOpenChange } = React.useContext(SheetContext)
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => onOpenChange(true),
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

export function SheetContent({ children, className, side = 'left' }: SheetContentProps) {
  const { open, onOpenChange } = React.useContext(SheetContext)

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  const sideClasses = {
    left: 'left-0 top-0 h-full w-3/4 sm:w-96',
    right: 'right-0 top-0 h-full w-3/4 sm:w-96',
    top: 'top-0 left-0 w-full h-3/4',
    bottom: 'bottom-0 left-0 w-full h-3/4',
  }

  const slideClasses = {
    left: open ? 'translate-x-0' : '-translate-x-full',
    right: open ? 'translate-x-0' : 'translate-x-full',
    top: open ? 'translate-y-0' : '-translate-y-full',
    bottom: open ? 'translate-y-0' : 'translate-y-full',
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          'fixed z-50 bg-white shadow-xl transition-transform duration-300',
          'flex flex-col',
          sideClasses[side],
          slideClasses[side],
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </>
  )
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col space-y-2 px-6 py-4 border-b', className)}>
      {children}
    </div>
  )
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-lg font-semibold text-primary', className)}>
      {children}
    </h2>
  )
}

export function SheetDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-text-secondary', className)}>
      {children}
    </p>
  )
}
