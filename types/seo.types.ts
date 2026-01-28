export interface SEOMetadata {
  title: string
  description: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface SchemaOrgProduct {
  '@context': string
  '@type': 'Product'
  name: string
  description?: string
  sku?: string
  brand?: {
    '@type': 'Brand'
    name: string
  }
}

export interface SchemaOrgBreadcrumb {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}
