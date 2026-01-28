# Dental Market

A Next.js (App Router) dental e-commerce platform with database-driven SEO redirects powered by Supabase.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for database-driven SEO redirects
- **Middleware** for handling redirects (301, 302, 410)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Iwamergun/dentalmarket.git
cd dentalmarket
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

Create a `seo_redirects` table in your Supabase database with the following schema:

```sql
CREATE TABLE seo_redirects (
  id SERIAL PRIMARY KEY,
  from_path TEXT NOT NULL,
  to_path TEXT,
  status_code INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add an index for performance
CREATE INDEX idx_seo_redirects_from_path ON seo_redirects(from_path) WHERE is_active = true;
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## SEO Redirects

The middleware automatically handles SEO redirects from the `seo_redirects` table:

- **Exact path matching**: Matches `from_path` exactly to the request pathname
- **Active redirects only**: Only processes redirects where `is_active = true`
- **Expiration handling**: Respects `expires_at` field (null or future date)
- **Priority ordering**: Uses the redirect with the lowest priority value
- **Querystring preservation**: Maintains URL query parameters during redirects

### Supported Status Codes

- **301**: Permanent redirect
- **302**: Temporary redirect
- **410**: Gone (resource permanently removed)

### Skipped Paths

The following paths are excluded from redirect processing:
- `/_next/*` - Next.js internal routes
- `/api/*` - API routes
- `/robots.txt` - Robots file
- `/sitemap*` - Sitemap files
- `/favicon.ico` - Favicon

### Example Redirects

```sql
-- 301 Permanent Redirect
INSERT INTO seo_redirects (from_path, to_path, status_code, is_active, priority)
VALUES ('/old-page', '/new-page', 301, true, 0);

-- 302 Temporary Redirect
INSERT INTO seo_redirects (from_path, to_path, status_code, is_active, priority)
VALUES ('/promo', '/special-offer', 302, true, 0);

-- 410 Gone
INSERT INTO seo_redirects (from_path, to_path, status_code, is_active, priority)
VALUES ('/removed-product', NULL, 410, true, 0);

-- Redirect with expiration
INSERT INTO seo_redirects (from_path, to_path, status_code, is_active, priority, expires_at)
VALUES ('/seasonal', '/summer-sale', 302, true, 0, '2026-09-01 00:00:00+00');
```

## Testing

The application includes two test pages:
- `/` - Home page
- `/yeni` - Yeni (New) page

## Project Structure

```
dentalmarket/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── yeni/
│       └── page.tsx     # Yeni page
├── lib/
│   └── supabase.ts      # Supabase client
├── middleware.ts        # SEO redirect middleware
├── .env.example         # Environment variables template
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## License

MIT
