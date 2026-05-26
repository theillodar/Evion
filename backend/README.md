# Backend (Strapi + PostgreSQL)

## Quick Start

1. Copy env file:
   - `cp .env.example .env` (PowerShell: `Copy-Item .env.example .env`)
2. Start PostgreSQL + CMS:
   - `docker compose up -d`
3. Open Strapi admin:
   - `http://localhost:1337/admin`

Alternative local run (without Docker for CMS):

1. Start only PostgreSQL in Docker.
2. Open another terminal and run:
   - `cd backend/cms`
   - `Copy-Item .env.example .env`
   - `npm install`
   - `npm run develop`

## Implemented Content Types

1. Product (collection type)
2. Brand (collection type)
3. Category (collection type)
4. Site Setting (single type)

Files are created in `backend/cms/src/api/*`.

Product lifecycle is implemented in:
- `backend/cms/src/api/product/content-types/product/lifecycles.ts`

Lifecycle behavior:
- If `code` is empty on create, it auto-generates `AMZ-001`, `AMZ-002`, ...

## Recommended Strapi Content Types

1. Product
   - name (text, localized)
   - slug (uid)
   - code (text, unique)
   - price (decimal)
   - oldPrice (decimal, optional)
   - status (enum: in_stock, sold, reserved)
   - description (rich text, localized)
   - shortDescription (text, localized)
   - specs (json, optional)
   - images (media multiple)
   - brand (relation many-to-one Brand)
   - category (relation many-to-one Category)

2. Brand
   - name (text, unique)

3. Category
   - name (text, unique, localized optional)

4. SiteSettings
   - telegramLink
   - whatsappLink
   - instagramLink
   - tiktokLink

## Code Generation Strategy

For product code generation use lifecycle hook beforeCreate:
- Query latest code with prefix `AMZ-`
- Increment numeric part and pad to 3+ digits
- Save generated value like `AMZ-001`

## Frontend Integration

Frontend should fetch from Strapi REST API:
- `/api/products?populate=*`
- `/api/brands`
- `/api/categories`

Add public role permissions for read-only endpoints.
