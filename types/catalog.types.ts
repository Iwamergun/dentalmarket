import { Database } from './database.types'

export type Product = Database['public']['Tables']['catalog_products']['Row']
export type ProductInsert = Database['public']['Tables']['catalog_products']['Insert']
export type ProductUpdate = Database['public']['Tables']['catalog_products']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Brand = Database['public']['Tables']['brands']['Row']
export type BrandInsert = Database['public']['Tables']['brands']['Insert']
export type BrandUpdate = Database['public']['Tables']['brands']['Update']

export interface ProductWithRelations extends Product {
  brand?: Brand | null
  category?: Category | null
}

export interface CategoryWithChildren extends Category {
  children?: Category[]
}
