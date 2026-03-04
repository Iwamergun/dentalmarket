import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils/cn'

describe('cn utility', () => {
  it('tek class string\'i geçirmeli', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('birden fazla class birleştirmeli', () => {
    expect(cn('px-2', 'py-1', 'text-sm')).toBe('px-2 py-1 text-sm')
  })

  it('conditional class\'lar (falsy değerler filtrelenmeli)', () => {
    expect(cn('text-sm', false && 'text-lg', undefined, null, '')).toBe('text-sm')
  })

  it('Tailwind conflict resolution çalışmalı (px-2 px-4 → px-4)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('boş argümanlarla çağrılabilmeli', () => {
    expect(cn()).toBe('')
  })
})
