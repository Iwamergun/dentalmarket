/**
 * Image URL Helper Utility
 * Handles image URL resolution for various sources (R2, external URLs, local paths)
 */

/** Default placeholder image path */
const PLACEHOLDER_IMAGE = '/placeholder-product.jpg'

/**
 * Resolves an image path to a full URL
 * 
 * @param imagePath - The image path (can be null, undefined, relative, or absolute URL)
 * @returns The resolved image URL
 * 
 * @example
 * // Returns placeholder for null/undefined
 * getImageUrl(null) // '/placeholder-product.jpg'
 * 
 * @example
 * // Returns external URLs as-is
 * getImageUrl('https://example.com/image.jpg') // 'https://example.com/image.jpg'
 * 
 * @example
 * // Returns local paths as-is
 * getImageUrl('/images/product.jpg') // '/images/product.jpg'
 * 
 * @example
 * // Prepends R2 URL for relative paths
 * getImageUrl('products/image.jpg') // 'https://r2.example.com/products/image.jpg'
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  // Return placeholder for null/undefined/empty values
  if (!imagePath || imagePath.trim() === '') {
    return PLACEHOLDER_IMAGE
  }

  const trimmedPath = imagePath.trim()

  // Return external URLs as-is
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath
  }

  // Return local paths (starting with /) as-is
  if (trimmedPath.startsWith('/')) {
    return trimmedPath
  }

  // For relative paths, prepend R2 public URL if available
  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

  if (r2PublicUrl) {
    // Remove trailing slash from R2 URL if present
    const baseUrl = r2PublicUrl.replace(/\/$/, '')
    return `${baseUrl}/${trimmedPath}`
  }

  // Fallback: return as local path
  return `/${trimmedPath}`
}

/**
 * Checks if an image path is a valid URL or path
 * 
 * @param imagePath - The image path to check
 * @returns True if the path is valid (not null/undefined/empty)
 */
export function hasValidImage(imagePath: string | null | undefined): boolean {
  return !!(imagePath && imagePath.trim() !== '')
}

export default getImageUrl
