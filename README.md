# Dental Market

A modern B2B e-commerce marketplace for dental products and equipment built with Next.js 15, TypeScript, Supabase, and TailwindCSS.

## Features

- 🚀 **Next.js 15** with App Router for optimal performance
- 🎨 **TailwindCSS** for modern, responsive design
- 🔐 **Supabase** for authentication and database
- 🔍 **SEO Optimized** with structured data and dynamic sitemaps
- 📱 **Responsive Design** works on all devices
- 🌐 **Turkish Language Support**
- 🏗️ **TypeScript** for type safety

## Project Structure

```
dentalmarket/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                # Public routes (no auth required)
│   │   ├── layout.tsx           # Public layout with header/footer
│   │   ├── page.tsx             # Homepage
│   │   ├── urunler/             # Products
│   │   ├── kategoriler/         # Categories
│   │   └── markalar/            # Brands
│   ├── (dashboard)/             # Authenticated routes
│   │   └── dashboard/
│   ├── sitemap.ts               # Dynamic sitemap generation
│   └── robots.ts                # Robots.txt generation
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── layout/                  # Layout components
│   ├── catalog/                 # Catalog-specific components
│   └── seo/                     # SEO components
├── lib/
│   ├── supabase/                # Supabase configuration
│   ├── utils/                   # Utility functions
│   └── constants/               # Constants and configuration
└── types/                       # TypeScript type definitions
```

## Prerequisites

- Node.js 20+ 
- npm or yarn
- Supabase account

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Iwamergun/dentalmarket.git
cd dentalmarket
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://legnknboyjkvyoojvqxg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Dental Market
```

**Important:** Replace `your_anon_key_here` and `your_service_role_key_here` with your actual Supabase keys.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables in Supabase:

- **catalog_products** - Product information
- **categories** - Hierarchical categories
- **brands** - Product brands
- **offers** - Supplier offers
- **profiles** - User profiles

See `types/database.types.ts` for complete type definitions.

## SEO Features

### Structured Data
- Product schema markup
- Breadcrumb navigation
- Organization schema

### Dynamic Sitemap
Automatically generates sitemap.xml including:
- All active products
- All categories
- All brands
- Static pages

### Meta Tags
- Dynamic page titles and descriptions
- Canonical URLs
- Open Graph tags
- Robots meta directives

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Docker containers

Make sure to set the environment variables on your deployment platform.

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | `https://dentalmarket.com` |
| `NEXT_PUBLIC_SITE_NAME` | Your site name | `Dental Market` |

## Security Notes

- Next.js 15.2.x has a moderate severity vulnerability related to memory consumption. Consider upgrading to Next.js 16+ when stable.
- Never commit `.env.local` to version control
- Keep your Supabase service role key secure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email info@dentalmarket.com or open an issue in the GitHub repository.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
