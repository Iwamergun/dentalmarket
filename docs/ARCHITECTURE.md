# Architecture Documentation

## Overview

Dental Market is built using modern web technologies with a focus on performance, SEO, and scalability. This document explains the architectural decisions and patterns used throughout the application.

## Technology Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service (Authentication + PostgreSQL)

### Key Dependencies

- `@supabase/ssr` - Supabase client for server-side rendering
- `clsx` + `tailwind-merge` - Class name utilities
- `next` - Framework

## Folder Structure

### App Directory (`/app`)

The application uses Next.js 15 App Router with route groups for organization:

#### Route Groups

**`(public)/`** - Public-facing pages
- No authentication required
- Includes header and footer
- Contains: homepage, products, categories, brands

**`(dashboard)/`** - Authenticated pages
- Requires user authentication
- Different layout from public pages
- Protected by middleware

#### Special Files

- `layout.tsx` - Root layout for the application
- `sitemap.ts` - Dynamic sitemap generation
- `robots.ts` - Robots.txt configuration
- `middleware.ts` - Authentication middleware

### Components (`/components`)

Organized by feature and function:

#### `/ui` - Reusable UI Components
- `button.tsx` - Button with variants (default, outline, ghost)
- `card.tsx` - Card with subcomponents (Header, Content, Footer)
- `input.tsx` - Form input with consistent styling
- `badge.tsx` - Badge with color variants

#### `/layout` - Layout Components
- `header.tsx` - Site header with navigation
- `footer.tsx` - Site footer with links
- `navigation.tsx` - Main navigation menu

#### `/catalog` - Catalog-Specific Components
- `product-card.tsx` - Product display card
- `product-grid.tsx` - Grid layout for products
- `category-card.tsx` - Category display card
- `brand-card.tsx` - Brand display card

#### `/seo` - SEO Components
- `breadcrumbs.tsx` - Breadcrumb navigation with Schema.org markup
- `schema-markup.tsx` - Generic Schema.org JSON-LD component
- `meta-tags.tsx` - Helper for generating meta tags

### Library Code (`/lib`)

#### `/supabase` - Supabase Integration

**Client-side (`client.ts`)**
```typescript
import { createBrowserClient } from '@supabase/ssr'
```
- Used in client components
- Browser environment only

**Server-side (`server.ts`)**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
```
- Used in server components and API routes
- Handles cookie-based authentication

**Middleware (`middleware.ts`)**
- Protects routes requiring authentication
- Refreshes auth tokens
- Redirects unauthenticated users

**Query Helpers (`/queries`)**
- `products.ts` - Product queries
- `categories.ts` - Category queries
- `brands.ts` - Brand queries
- Centralized data fetching logic
- Type-safe database queries

#### `/utils` - Utility Functions

- `cn.ts` - Class name merging utility
- `seo.ts` - SEO helper functions
- `format.ts` - Formatting utilities (price, date, numbers)

#### `/constants` - Configuration

- `site-config.ts` - Site-wide configuration

### Types (`/types`)

Type definitions for the application:

- `database.types.ts` - Generated from Supabase schema
- `catalog.types.ts` - Catalog-related types (Product, Category, Brand)
- `seo.types.ts` - SEO-related types

## Data Flow

### Server-Side Data Fetching

```
Page Component → Query Helper → Supabase Server Client → Database
```

1. Page component imports query helper
2. Query helper uses server client
3. Data fetched on server
4. Rendered HTML sent to browser

### Client-Side Interactions

```
Client Component → Supabase Browser Client → Database
```

Used for interactive features that need real-time updates.

## SEO Strategy

### 1. Server-Side Rendering (SSR)

All public pages are server-rendered for optimal SEO:
- Fast initial page load
- Complete HTML for search engines
- Dynamic meta tags

### 2. Structured Data

Schema.org markup for:
- **Products** - Name, description, SKU, brand
- **Breadcrumbs** - Navigation hierarchy
- **Organization** - Site information

### 3. Dynamic Sitemaps

`app/sitemap.ts` generates XML sitemap including:
- Static pages (priority: 1.0)
- Product pages (priority: 0.7, weekly updates)
- Category pages (priority: 0.7, weekly updates)
- Brand pages (priority: 0.6, monthly updates)

### 4. Meta Tags

Each page generates:
- Title (optimized for search)
- Description (compelling, under 160 chars)
- Canonical URL (prevents duplicate content)
- Robots directives (control indexing)

## Authentication Flow

### Protected Routes

1. User navigates to `/dashboard/*`
2. Middleware intercepts request
3. Checks for valid session
4. If no session → redirect to `/`
5. If session valid → allow access

### Session Management

- Cookies stored in browser
- Server validates on each request
- Automatic token refresh
- Secure, HTTP-only cookies

## Component Patterns

### Server Components (Default)

```typescript
// app/(public)/urunler/page.tsx
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

Benefits:
- Zero JavaScript sent to client
- Direct database access
- SEO-friendly

### Client Components

```typescript
'use client'

export function InteractiveComponent() {
  const [state, setState] = useState()
  // Client-side interactivity
}
```

Use when:
- Need useState, useEffect
- Browser APIs required
- Event handlers needed

## Performance Optimizations

### 1. Image Optimization

Next.js Image component:
- Automatic WebP conversion
- Lazy loading
- Responsive images

### 2. Code Splitting

Automatic by Next.js:
- Each route = separate bundle
- Shared code extracted
- Dynamic imports for large components

### 3. Static Generation

Static pages when possible:
- Built at compile time
- Served from CDN
- Instant load times

### 4. Turbopack

Development server uses Turbopack:
- Faster builds
- Improved HMR
- Better DX

## Database Schema

### Key Tables

**catalog_products**
- Product information
- Links to brand and category
- SEO fields

**categories**
- Hierarchical structure
- Path-based queries
- Depth tracking

**brands**
- Brand information
- SEO metadata

**offers**
- Supplier pricing
- Stock information
- Active/inactive status

### Relationships

```
products → brands (many-to-one)
products → categories (many-to-many via junction table)
offers → products (many-to-one)
offers → profiles (many-to-one)
```

## Security Considerations

### 1. Environment Variables

- Separate `.env.local` for local dev
- `.env.example` for reference
- Never commit secrets

### 2. Row Level Security (RLS)

Supabase RLS policies:
- Products: Public read, authenticated write
- Profiles: Owner-only access
- Offers: Supplier-only access

### 3. Type Safety

TypeScript ensures:
- Correct data types
- No runtime errors
- Better IDE support

## Deployment

### Build Process

```bash
npm run build
```

Steps:
1. TypeScript compilation
2. ESLint checks
3. Route generation
4. Static page generation
5. Optimization

### Environment Setup

Production requires:
- Supabase URL
- Supabase keys
- Site URL
- Any third-party API keys

### Recommended Platform

**Vercel** (optimal for Next.js):
- Zero configuration
- Automatic deployments
- Edge functions
- Analytics

## Future Enhancements

### Planned Features

1. **Search** - Full-text search with filters
2. **Cart** - Shopping cart functionality
3. **Orders** - Order management system
4. **Admin Panel** - Product/order management
5. **Analytics** - Usage tracking
6. **Reviews** - Product reviews and ratings

### Performance Improvements

1. **ISR** - Incremental Static Regeneration
2. **Caching** - Redis for hot data
3. **CDN** - Asset optimization
4. **Compression** - Brotli/Gzip

## Development Guidelines

### Code Style

- Use TypeScript for all files
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful comments

### Component Guidelines

- Keep components small
- Single responsibility
- Reusable when possible
- Props validation with TypeScript

### Naming Conventions

- Components: PascalCase
- Files: kebab-case.tsx
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

## Testing Strategy

### Unit Tests
- Component logic
- Utility functions
- Data transformations

### Integration Tests
- API routes
- Database queries
- Authentication flows

### E2E Tests
- User journeys
- Critical paths
- Cross-browser testing

## Monitoring

### Metrics to Track

- Page load times
- Time to First Byte (TTFB)
- Core Web Vitals
- Error rates
- API response times

### Tools

- Vercel Analytics
- Sentry (error tracking)
- Google Search Console
- Lighthouse scores

## Troubleshooting

### Common Issues

**Build Errors**
- Clear `.next` folder
- Delete `node_modules`
- Run `npm install` again

**Supabase Connection**
- Check environment variables
- Verify network connectivity
- Check Supabase dashboard

**Type Errors**
- Regenerate types from Supabase
- Check `database.types.ts`
- Run `npm run build`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Contact

For questions or support, contact the development team.
