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

  it('tüm bölümlerde gerçek API entegrasyonu için TODO bilgisi olmalı', () => {
    sections.forEach((section) => {
      expect(section.apiTodo).toContain('TODO:')
      expect(section.apiTodo).toContain('/api/admin/')
    })

    expect(customersSection.apiTodo).toContain('/api/admin/customers')
    expect(categoriesSection.apiTodo).toContain('/api/admin/categories')
    expect(brandsSection.apiTodo).toContain('/api/admin/brands')
    expect(reportsSection.apiTodo).toContain('/api/admin/reports')
    expect(settingsSection.apiTodo).toContain('/api/admin/settings')
  })
})
