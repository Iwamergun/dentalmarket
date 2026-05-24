import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CatalogProductNameSelect from '@/components/supplier/CatalogProductNameSelect'

describe('CatalogProductNameSelect', () => {
  it('arama sonuçlarını dropdown olarak gösterip seçim yaptırmalı', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()

    render(
      <CatalogProductNameSelect
        value="endo"
        searching={false}
        results={[
          { id: 'prod-1', name: 'Endo Motor', sku: 'ENDO-1' },
          { id: 'prod-2', name: 'Endo Eğe', sku: 'ENDO-2' },
        ]}
        selectedProductId={null}
        onValueChange={vi.fn()}
        onSelect={onSelect}
      />
    )

    expect(screen.getByRole('combobox', { name: 'Ürün Adı' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Endo Motor/i }))
    expect(onSelect).toHaveBeenCalledWith('prod-1')
  })
})
