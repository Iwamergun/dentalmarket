'use client'

import { Search } from 'lucide-react'

type CatalogProductNameOption = {
  id: string
  name: string
  sku: string | null
}

interface CatalogProductNameSelectProps {
  value: string
  searching: boolean
  results: CatalogProductNameOption[]
  selectedProductId: string | null
  onValueChange: (value: string) => void
  onSelect: (productId: string) => void
  onSuggest: () => void
}

export default function CatalogProductNameSelect({
  value,
  searching,
  results,
  selectedProductId,
  onValueChange,
  onSelect,
  onSuggest,
}: CatalogProductNameSelectProps) {
  const hasSearch = value.trim().length >= 2
  const listboxId = 'catalog-product-name-options'

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ürün Adı <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Katalogdan ürün adı arayın..."
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={results.length > 0}
          aria-autocomplete="list"
          aria-label="Ürün Adı"
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {searching && <p className="text-sm text-gray-500">Aranıyor...</p>}

      {results.length > 0 && (
        <div
          id={listboxId}
          className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto divide-y divide-gray-100"
        >
          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900 truncate">{product.name}</span>
              {product.sku && <span className="text-xs text-gray-500">SKU: {product.sku}</span>}
            </button>
          ))}
        </div>
      )}

      {selectedProductId ? (
        <p className="text-xs text-green-700">Katalog ürünü seçildi.</p>
      ) : (
        <p className="text-xs text-gray-500">
          Ürün adı serbest girilemez, listeden seçim yapılmalıdır.
        </p>
      )}

      {hasSearch && !searching && results.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-900">
            Sonuç bulunamadı. Katalogda yoksa öneri gönderebilirsiniz.
          </p>
          <button
            type="button"
            onClick={onSuggest}
            className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            + Ürün Öner
          </button>
        </div>
      )}
    </div>
  )
}
