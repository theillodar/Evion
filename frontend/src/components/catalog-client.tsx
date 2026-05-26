"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CatalogFilters as CatalogFiltersUI } from "@/components/catalog-filters";
import { CatalogFilters, filterAndSortProducts, SortKey } from "@/lib/catalog";
import { Product, Translation, Locale } from "@/lib/types";

type Props = {
  locale: Locale;
  tr: Translation;
  products: Product[];
  categories: string[];
  brands: string[];
  initialFilters?: Partial<CatalogFilters>;
};

export function CatalogClient({ locale, tr, products, categories, brands, initialFilters }: Props) {
  const [filters, setFilters] = useState<CatalogFilters>({
    query: "",
    brand: "",
    category: "",
    inStockOnly: false,
    sort: "newest",
    ...initialFilters,
  });

  const result = useMemo(() => filterAndSortProducts(products, filters), [products, filters]);

  return (
    <div className="space-y-6">
      <CatalogFiltersUI
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        brands={brands}
        tr={tr}
        locale={locale}
      />

      {result.length === 0 ? (
        <div className="card-glow p-10 text-center text-white/60">{tr.catalog.noResults}</div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.map((item, index) => (
            <ProductCard
              key={item.id}
              locale={locale}
              product={item}
              tr={tr}
              delay={index * 0.05}
              priorityImage={index < 3}
            />
          ))}
        </section>
      )}
    </div>
  );
}
