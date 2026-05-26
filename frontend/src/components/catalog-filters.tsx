"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { CatalogFilters as CatalogFiltersType, SortKey } from "@/lib/catalog";
import { Translation, Locale } from "@/lib/types";
import { translateCategoryName } from "@/lib/category-translations";

type Props = {
  filters: CatalogFiltersType;
  onFilterChange: (filters: CatalogFiltersType) => void;
  categories: string[];
  brands: string[];
  tr: Translation;
  locale?: Locale;
};

export function CatalogFilters({
  filters,
  onFilterChange,
  categories,
  brands,
  tr,
  locale = "pl",
}: Props) {
  const sortOptions: Array<{ key: SortKey; label: string }> = [
    { key: "newest", label: tr.sort.newest },
    { key: "price_asc", label: tr.sort.priceAsc },
    { key: "price_desc", label: tr.sort.priceDesc },
    { key: "name_asc", label: tr.sort.nameAsc },
  ];

  return (
    <motion.section
      className="space-y-4 card-glow p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search */}
      <div>
        <input
          value={filters.query}
          onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
          placeholder={tr.catalog.search}
          className="field w-full"
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-white/60 mb-2">{tr.catalog.allCategories}</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: filters.category === cat ? "" : cat })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === cat
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/50"
                    : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white/90"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translateCategoryName(cat, locale)}
              </motion.button>
            ))}
            {filters.category && (
              <motion.button
                onClick={() => onFilterChange({ ...filters, category: "" })}
                className="px-3 py-2 rounded-lg text-xs bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <X size={14} />
                Clear
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-white/60 mb-2">{tr.catalog.allBrands}</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <motion.button
                key={brand}
                onClick={() => onFilterChange({ ...filters, brand: filters.brand === brand ? "" : brand })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.brand === brand
                    ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-lg shadow-orange-500/50"
                    : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white/90"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {brand}
              </motion.button>
            ))}
            {filters.brand && (
              <motion.button
                onClick={() => onFilterChange({ ...filters, brand: "" })}
                className="px-3 py-2 rounded-lg text-xs bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80 flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <X size={14} />
                Clear
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Sort and Stock */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-white/60">{tr.catalog.sortLabel}</p>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <motion.button
              key={option.key}
              type="button"
              onClick={() => onFilterChange({ ...filters, sort: option.key })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.sort === option.key
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-500/40"
                  : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white/90"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={filters.sort === option.key}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 hover:border-white/30 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="accent-blue-400 rounded"
          />
          <span className="text-xs">{tr.catalog.inStockOnly}</span>
        </label>
      </div>
    </motion.section>
  );
}
