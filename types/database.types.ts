export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          is_active: boolean
          seo_title: string | null
          seo_description: string | null
          canonical_url: string | null
          noindex: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_active?: boolean
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          noindex?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          is_active?: boolean
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          noindex?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          parent_id: string | null
          name: string
          slug: string
          seo_title: string | null
          seo_description: string | null
          canonical_url: string | null
          noindex: boolean
          description: string | null
          depth: number
          path: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          name: string
          slug: string
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          noindex?: boolean
          description?: string | null
          depth?: number
          path: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          name?: string
          slug?: string
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          noindex?: boolean
          description?: string | null
          depth?: number
          path?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      catalog_products: {
        Row: {
          id: string
          brand_id: string | null
          primary_category_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          sku: string | null
          barcode: string | null
          manufacturer_code: string | null
          seo_title: string | null
          seo_description: string | null
          canonical_url: string | null
          noindex: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id?: string | null
          primary_category_id?: string | null
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          sku?: string | null
          barcode?: string | null
          manufacturer_code?: string | null
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          noindex?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string | null
          primary_category_id?: string | null
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          sku?: string | null
          barcode?: string | null
          manufacturer_code?: string | null
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          noindex?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      catalog_product_categories: {
        Row: {
          product_id: string
          category_id: string
          is_primary: boolean
        }
        Insert: {
          product_id: string
          category_id: string
          is_primary?: boolean
        }
        Update: {
          product_id?: string
          category_id?: string
          is_primary?: boolean
        }
      }
      catalog_product_images: {
        Row: {
          id: string
          product_id: string
          media_id: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          media_id: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          media_id?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      catalog_product_variants: {
        Row: {
          id: string
          product_id: string
          variant_name: string
          variant_sku: string | null
          attributes: Json
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_name: string
          variant_sku?: string | null
          attributes?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_name?: string
          variant_sku?: string | null
          attributes?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          role: string
          company_name: string | null
          tax_number: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: string
          company_name?: string | null
          tax_number?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          company_name?: string | null
          tax_number?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          supplier_id: string
          product_id: string
          variant_id: string | null
          supplier_sku: string | null
          price: number
          currency: string
          vat_rate: number
          stock_quantity: number
          lead_time_days: number
          min_order_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          product_id: string
          variant_id?: string | null
          supplier_sku?: string | null
          price: number
          currency: string
          vat_rate: number
          stock_quantity: number
          lead_time_days: number
          min_order_quantity: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          product_id?: string
          variant_id?: string | null
          supplier_sku?: string | null
          price?: number
          currency?: string
          vat_rate?: number
          stock_quantity?: number
          lead_time_days?: number
          min_order_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      media_assets: {
        Row: {
          id: string
          owner_profile_id: string | null
          storage_provider: string
          bucket: string | null
          object_path: string | null
          public_url: string | null
          mime_type: string | null
          width: number | null
          height: number | null
          bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_profile_id?: string | null
          storage_provider: string
          bucket?: string | null
          object_path?: string | null
          public_url?: string | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_profile_id?: string | null
          storage_provider?: string
          bucket?: string | null
          object_path?: string | null
          public_url?: string | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          bytes?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
