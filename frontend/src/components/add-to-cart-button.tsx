"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
  label?: string;
  className?: string;
};

export function AddToCartButton({ product, label = "Do koszyka", className }: Props) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className={
        className ||
        "inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/25 hover:border-blue-400/60"
      }
    >
      <ShoppingCart size={15} />
      {label}
    </button>
  );
}
