# EvionShop Frontend

Modern adaptive catalog for Amazon return products.

Stack:
- Next.js (App Router)
- React
- Tailwind CSS v4
- TypeScript

Design direction:
- dark neon tech UI
- responsive layout for desktop/tablet/mobile
- multilingual interface: Polish, Ukrainian, English

## Implemented Features

1. Home page
- hero block
- benefits
- categories
- popular products
- brands
- social links
- CTA block

2. Catalog
- product grid
- search by name/code/description
- filtering by category and brand
- availability filter
- sorting

3. Product page
- title, unique code, price
- description and specs
- gallery
- statuses: in stock, sold, reserved
- direct Telegram/WhatsApp contact buttons with prefilled message

4. Admin page (demo CMS layer)
- add product
- edit product
- delete product
- change product status
- generate product code (AMZ-001, AMZ-002...)
- multiple image URLs input
- localStorage persistence for demo

5. SEO baseline
- metadata
- OpenGraph
- sitemap.xml
- robots.txt

6. Strapi integration mode
- frontend tries to fetch products from Strapi (`STRAPI_URL`)
- if Strapi is unavailable, app falls back to local seed data
- this keeps local development stable before backend launch

## Run Frontend

Project path is on drive G:
- G:\evion\frontend

Commands:

```powershell
Set-Location "G:\evion\frontend"
npm install
Copy-Item .env.example .env.local
npm run dev
```

Build check:

```powershell
npm run lint
npm run build
```

## Backend (Strapi + PostgreSQL)

Backend scaffold is prepared at:
- G:\evion\backend

Run with Docker:

```powershell
Set-Location "G:\evion\backend"
Copy-Item .env.example .env
docker compose up -d
```

Strapi admin:
- http://localhost:1337/admin

## Notes

- Social links are placeholders and can be replaced in `src/lib/contact.ts`.
- Demo frontend currently uses local product data from `src/lib/products.ts`.
- For production, connect pages to Strapi REST/GraphQL endpoints.
