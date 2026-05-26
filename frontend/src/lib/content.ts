import { getDefaultCategories } from "@/lib/default-categories";
import { defaultLocale } from "@/lib/i18n";
import { Locale, Product, ProductStatus } from "@/lib/types";

type CatalogData = {
  products: Product[];
  categories: string[];
  brands: string[];
};

function normalizeStatus(value: unknown): ProductStatus {
  if (value === "sold" || value === "reserved" || value === "in_stock") {
    return value;
  }
  return "in_stock";
}

function toAbsoluteMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const base = (process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function parseRelationName(value: unknown): string {
  const relation = value as
    | { data?: { attributes?: { name?: string }; name?: string } | null; name?: string }
    | undefined;

  return relation?.data?.attributes?.name ?? relation?.data?.name ?? relation?.name ?? "";
}

function parseImages(value: unknown): string[] {
  const relation = value as
    | {
        data?:
          | Array<{ attributes?: { url?: string }; url?: string }>
          | { attributes?: { url?: string }; url?: string }
          | null;
      }
    | Array<{ attributes?: { url?: string }; url?: string }>
    | { attributes?: { url?: string }; url?: string }
    | undefined
    | null;

  const rawData = Array.isArray(relation)
    ? relation
    : relation && typeof relation === "object" && "data" in relation
      ? relation.data
      : relation;

  if (!rawData) {
    return [];
  }

  const list = Array.isArray(rawData) ? rawData : [rawData];

  const normalizedList = list as Array<{ attributes?: { url?: string }; url?: string } | null | undefined>;

  return normalizedList
    .map((item) => item?.attributes?.url ?? item?.url)
    .filter((url): url is string => Boolean(url))
    .map((url) => toAbsoluteMediaUrl(url));
}

function parseProductRecord(record: unknown): Product | null {
  const root = record as { id?: number; attributes?: Record<string, unknown> };
  const source = (root?.attributes ?? root) as Record<string, unknown>;

  const slug = String(source.slug ?? "").trim();
  const name = String(source.name ?? "").trim();
  if (!slug || !name) {
    return null;
  }

  const id = Number(root?.id ?? source.id ?? Date.now());
  const price = Number(source.price ?? 0);
  const oldPriceValue = source.oldPrice ?? source.old_price;
  const oldPrice = oldPriceValue === null || oldPriceValue === undefined ? undefined : Number(oldPriceValue);

  const images = parseImages(source.images);

  const parsed: Product = {
    id: Number.isNaN(id) ? Date.now() : id,
    slug,
    code: String(source.code ?? `AMZ-${String(id).padStart(3, "0")}`),
    name,
    brand: parseRelationName(source.brand) || String(source.brand ?? "Unknown"),
    category: parseRelationName(source.category) || String(source.category ?? "Uncategorized"),
    price: Number.isNaN(price) ? 0 : price,
    status: normalizeStatus(source.status),
    shortDescription: String(source.shortDescription ?? source.short_description ?? name),
    description: String(source.description ?? source.shortDescription ?? name),
    specs: (source.specs as Record<string, string> | undefined) ?? undefined,
    images: images.length > 0 ? images : ["/items/laptop.svg"],
    featured: Boolean(source.featured),
  };

  if (oldPrice !== undefined && !Number.isNaN(oldPrice)) {
    parsed.oldPrice = oldPrice;
  }

  return parsed;
}

function deriveCatalogData(items: Product[], locale: Locale): CatalogData {
  const categorySet = new Set<string>(getDefaultCategories(locale));
  for (const category of items.map((item) => item.category)) {
    if (category) {
      categorySet.add(category);
    }
  }
  const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b, "ru"));
  const brands = Array.from(new Set(items.map((item) => item.brand))).sort();

  return {
    products: items,
    categories,
    brands,
  };
}

async function fetchFromStrapi(locale: Locale): Promise<Product[]> {
  const base = (process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(/\/$/, "");
  if (!base) {
    return [];
  }

  const token = process.env.STRAPI_API_TOKEN;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const url = `${base}/api/products?populate=*&locale=${locale}&pagination[pageSize]=100`;
  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { data?: unknown } | unknown[];
  const rows = Array.isArray(payload) ? payload : Array.isArray((payload as { data?: unknown }).data) ? ((payload as { data?: unknown[] }).data ?? []) : [];

  return rows.map((row) => parseProductRecord(row)).filter((item): item is Product => item !== null);
}

export async function getCatalogData(locale: Locale = defaultLocale): Promise<CatalogData> {
  try {
    const remoteProducts = await fetchFromStrapi(locale);
    return deriveCatalogData(remoteProducts, locale);
  } catch {
    // Return an empty catalog when backend is unavailable to avoid fake items.
    return deriveCatalogData([], locale);
  }
}

export async function getProductBySlug(slug: string, locale: Locale = defaultLocale): Promise<Product | null> {
  const { products } = await getCatalogData(locale);
  return products.find((item) => item.slug === slug) ?? null;
}
