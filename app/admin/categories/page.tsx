import { adminCategoriesMock } from '@/lib/admin/mock-data'

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
        <p className="mt-1 text-sm text-gray-500">
          Yönetim arayüzü için geçici kategori özeti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminCategoriesMock.map((category) => (
          <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">{category.name}</h2>
            <p className="mt-2 text-sm text-gray-600">Ürün Sayısı: {category.productCount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
