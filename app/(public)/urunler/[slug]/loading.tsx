export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Sol: Resim Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl" />
          {/* Thumbnails */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Sağ: Bilgi Skeleton */}
        <div className="space-y-6">
          {/* Marka badge */}
          <div className="h-6 w-24 bg-muted rounded-full" />
          
          {/* Ürün Adı */}
          <div className="space-y-2">
            <div className="h-9 w-3/4 bg-muted rounded" />
            <div className="h-9 w-1/2 bg-muted rounded" />
          </div>

          {/* SKU */}
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
          </div>

          {/* Kısa Açıklama */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-muted rounded" />
            <div className="h-5 w-2/3 bg-muted rounded" />
          </div>

          {/* Fiyat */}
          <div className="py-4 border-y border-border/50">
            <div className="h-10 w-48 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded mt-2" />
          </div>

          {/* Stok */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded-full" />
            <div className="h-6 w-24 bg-muted rounded-full" />
          </div>

          {/* Miktar + Sepete Ekle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-[54px] w-40 bg-muted rounded-lg" />
            <div className="h-[54px] flex-1 bg-muted rounded-lg" />
            <div className="h-[54px] w-[54px] bg-muted rounded-lg" />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-12 bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
        <div className="flex border-b border-border/50 gap-1 p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-28 bg-muted rounded" />
          ))}
        </div>
        <div className="p-6 space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="mt-12 space-y-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-xl" />
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16 space-y-6">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-9 w-full bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
