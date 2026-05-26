import { Product } from "@/lib/types";

export type SortKey = "newest" | "price_asc" | "price_desc" | "name_asc";

export type CatalogFilters = {
  query: string;
  brand: string;
  category: string;
  inStockOnly: boolean;
  sort: SortKey;
};

export function filterAndSortProducts(items: Product[], filters: CatalogFilters): Product[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const byQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const byBrand = !filters.brand || item.brand === filters.brand;
    const byCategory = !filters.category || item.category === filters.category;
    const byStock = !filters.inStockOnly || item.status === "in_stock";

    return byQuery && byBrand && byCategory && byStock;
  });

  switch (filters.sort) {
    case "price_asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price_desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "name_asc":
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return [...filtered].sort((a, b) => b.id - a.id);
  }
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}
