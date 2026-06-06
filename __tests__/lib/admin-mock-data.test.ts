import { describe, expect, it } from 'vitest'
import {
  brandsSection,
  categoriesSection,
  customersSection,
  reportsSection,
  settingsSection,
} from '@/lib/admin/mock-data'

const sections = [
  customersSection,
  categoriesSection,
  brandsSection,
  reportsSection,
  settingsSection,
]

describe('admin mock sections', () => {
  it('tüm satırlarda kolon sayısı ile değer sayısı eşleşmeli', () => {
    sections.forEach((section) => {
      section.rows.forEach((row) => {
        expect(row.values).toHaveLength(section.columns.length)
      })
    })
  })

  it('bölüm açıklamalarında geçici test metni olmamalı', () => {
    const blockedTerms = ['TODO:', 'geçici']

    sections.forEach((section) => {
      blockedTerms.forEach((term) => {
        expect(section.description).not.toContain(term)
      })
    })
  })
})
