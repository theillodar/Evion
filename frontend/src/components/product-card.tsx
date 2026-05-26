"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Product, Translation, Locale } from "@/lib/types";
import { formatPrice } from "@/lib/catalog";
import { translateCategoryName } from "@/lib/category-translations";
import { useCart } from "@/lib/cart-context";

type Props = {
  locale: Locale;
  product: Product;
  tr: Translation;
  delay?: number;
  priorityImage?: boolean;
};

export function ProductCard({ locale, product, tr, delay = 0, priorityImage = false }: Props) {
  const { addToCart } = useCart();
  return (
    <motion.article
      className="card-glow overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={`/${locale}/catalog/${product.slug}`} className="block">
        <div className="relative h-44 w-full bg-[radial-gradient(circle_at_40%_30%,rgba(79,70,229,0.35),transparent_60%)] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover opacity-95"
              priority={priorityImage}
              loading={priorityImage ? "eager" : "lazy"}
            />
          </motion.div>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <p className="text-xs text-white/55">{tr.product.code}: {product.code}</p>
        <Link href={`/${locale}/catalog/${product.slug}`} className="line-clamp-2 text-sm font-medium text-white hover:text-blue-300">
          {product.name}
        </Link>
        <p className="text-xs text-white/55">{product.brand} · {translateCategoryName(product.category, locale)}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">{formatPrice(product.price)}</span>
          {product.oldPrice ? <span className="text-xs text-white/40 line-through">{formatPrice(product.oldPrice)}</span> : null}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full border border-white/15 px-2 py-1 text-white/75">{tr.status[product.status]}</span>
          <button
            onClick={() => addToCart(product)}
            className="inline-flex items-center gap-1 rounded-lg border border-blue-500/35 bg-blue-500/12 px-2 py-1 text-blue-300 transition hover:bg-blue-500/22"
            disabled={product.status === "sold"}
          >
            <ShoppingCart size={12} />
            <span>Koszyk</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
