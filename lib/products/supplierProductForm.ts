export type SupplierProductFormState = {
  name: string
  slug: string
  sku: string
  barcode: string
  short_description: string
  description: string
  primary_category_id: string
  brand_id: string
  primary_image: string
  is_active: boolean
  price: string
  compare_at_price: string
  vat_rate: string
  stock_quantity: string
  min_order_quantity: string
  lead_time_days: string
  shipping_cost: string
  free_shipping_threshold: string
  payment_options: string[]
  notes: string
}

export type CatalogProductSelection = {
  id: string
  name: string
  slug: string
  sku: string | null
  barcode: string | null
  short_description: string | null
  description: string | null
  primary_category_id: string | null
  brand_id: string | null
  primary_image: string | null
  compare_at_price: number | null
}

export const defaultSupplierProductFormState: SupplierProductFormState = {
  name: '',
  slug: '',
  sku: '',
  barcode: '',
  short_description: '',
  description: '',
  primary_category_id: '',
  brand_id: '',
  primary_image: '',
  is_active: true,
  price: '',
  compare_at_price: '',
  vat_rate: '20',
  stock_quantity: '',
  min_order_quantity: '1',
  lead_time_days: '0',
  shipping_cost: '0',
  free_shipping_threshold: '',
  payment_options: [],
  notes: '',
}

export function slugifyProductName(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function resolveProductSlug(name: string, slug?: string | null) {
  return slug || slugifyProductName(name)
}

export function applyCatalogProductSelection(
  form: SupplierProductFormState,
  product: CatalogProductSelection
): SupplierProductFormState {
  return {
    ...form,
    name: product.name,
    slug: resolveProductSlug(product.name, product.slug),
    sku: product.sku ?? '',
    barcode: product.barcode ?? '',
    short_description: product.short_description ?? '',
    description: product.description ?? '',
    primary_category_id: product.primary_category_id ?? '',
    brand_id: product.brand_id ?? '',
    primary_image: product.primary_image ?? '',
    compare_at_price: product.compare_at_price != null ? String(product.compare_at_price) : '',
  }
}

export function buildSupplierProductFormState(params: {
  product: Omit<CatalogProductSelection, 'id'>
  price?: number | null
  vatRate?: number | null
  stockQuantity?: number | null
  minOrderQuantity?: number | null
  leadTimeDays?: number | null
  shippingCost?: number | null
  freeShippingThreshold?: number | null
  paymentOptions?: string[] | null
  notes?: string | null
  isActive?: boolean | null
}): SupplierProductFormState {
  const { product } = params

  return {
    name: product.name,
    slug: resolveProductSlug(product.name, product.slug),
    sku: product.sku ?? '',
    barcode: product.barcode ?? '',
    short_description: product.short_description ?? '',
    description: product.description ?? '',
    primary_category_id: product.primary_category_id ?? '',
    brand_id: product.brand_id ?? '',
    primary_image: product.primary_image ?? '',
    is_active: params.isActive ?? true,
    price: params.price != null ? String(params.price) : '',
    compare_at_price: product.compare_at_price != null ? String(product.compare_at_price) : '',
    vat_rate: params.vatRate != null ? String(params.vatRate) : '20',
    stock_quantity: params.stockQuantity != null ? String(params.stockQuantity) : '',
    min_order_quantity: params.minOrderQuantity != null ? String(params.minOrderQuantity) : '1',
    lead_time_days: params.leadTimeDays != null ? String(params.leadTimeDays) : '0',
    shipping_cost: params.shippingCost != null ? String(params.shippingCost) : '0',
    free_shipping_threshold: params.freeShippingThreshold != null
      ? String(params.freeShippingThreshold)
      : '',
    payment_options: params.paymentOptions ?? [],
    notes: params.notes ?? '',
  }
}

export function buildCatalogProductPayload(
  form: SupplierProductFormState,
  supplierId: string
) {
  return {
    supplier_id: supplierId,
    name: form.name,
    slug: resolveProductSlug(form.name, form.slug),
    sku: form.sku || null,
    barcode: form.barcode || null,
    short_description: form.short_description || null,
    description: form.description || null,
    primary_category_id: form.primary_category_id || null,
    brand_id: form.brand_id || null,
    primary_image: form.primary_image || null,
    compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
    is_active: form.is_active,
  }
}

export function buildOfferPayload(
  form: SupplierProductFormState,
  supplierId: string,
  productId: string
) {
  return {
    supplier_id: supplierId,
    product_id: productId,
    supplier_sku: form.sku || null,
    price: parseFloat(form.price),
    vat_rate: parseInt(form.vat_rate) || 20,
    stock_quantity: parseInt(form.stock_quantity) || 0,
    min_order_quantity: parseInt(form.min_order_quantity) || 1,
    lead_time_days: parseInt(form.lead_time_days) || 0,
    shipping_cost: parseFloat(form.shipping_cost) || 0,
    free_shipping_threshold: form.free_shipping_threshold
      ? parseFloat(form.free_shipping_threshold)
      : null,
    payment_options: form.payment_options.length > 0 ? form.payment_options : null,
    notes: form.notes || null,
    currency: 'TRY',
    is_active: form.is_active,
  }
}
