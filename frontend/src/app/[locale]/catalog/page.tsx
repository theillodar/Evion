import { CatalogClient } from "@/components/catalog-client";
import { getCatalogData } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    category?: string;
    brand?: string;
    query?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  }>;
};

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const safeLocale: Locale = isLocale(locale) ? locale : "pl";
  const tr = t(safeLocale);
  const { products, categories, brands } = await getCatalogData(safeLocale);

  const initialFilters = {
    query: typeof resolvedSearchParams.query === "string" ? resolvedSearchParams.query : "",
    brand: typeof resolvedSearchParams.brand === "string" ? resolvedSearchParams.brand : "",
    category: typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "",
    sort: resolvedSearchParams.sort ?? "newest",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-white">{tr.catalog.title}</h1>
      </div>
      <CatalogClient
        locale={safeLocale}
        tr={tr}
        products={products}
        categories={categories}
        brands={brands}
        initialFilters={initialFilters}
      />
    </div>
  );
}
