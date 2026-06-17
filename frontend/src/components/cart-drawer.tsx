"use client";

import { X, Trash2, Send, MessageCircle, ShoppingCart } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { useCart, CartItem } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import { getTelegramLink, getWhatsAppLink } from "@/lib/contact";

function buildOrderMessage(items: CartItem[]): string {
  const orderRef = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.product.name}\n   Kod: ${item.product.code} | Nr: ${item.orderCode}${item.qty > 1 ? ` x${item.qty}` : ""}\n   Cena: ${formatPrice(item.product.price * item.qty)}`
  );
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  return `Dzień dobry! Chcę zamówić (${orderRef}):\n\n${lines.join("\n\n")}\n\nŁącznie: ${formatPrice(total)}`;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, clearCart, total, count } = useCart();

  if (!isOpen) return null;

  const message = items.length > 0 ? buildOrderMessage(items) : "";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#070b1f] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-300" />
            <h2 className="text-lg font-semibold text-white">Koszyk</h2>
            {count > 0 && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="icon-btn" aria-label="Close cart">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {items.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3 text-white/50">
              <ShoppingCart size={40} className="opacity-30" />
              <p className="text-sm">Koszyk jest pusty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                {item.product.images[0] && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                    <SafeImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-white">
                    {item.product.name}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">
                    Kod: {item.product.code}
                  </p>
                  <p className="mt-0.5 text-xs text-blue-300/70">
                    Nr zamówienia: {item.orderCode}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(item.product.price * item.qty)}
                    </p>
                    {item.qty > 1 && (
                      <span className="text-xs text-white/40">x{item.qty}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="icon-btn self-start flex-shrink-0"
                  aria-label="Remove from cart"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Łącznie:</span>
              <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
            </div>

            <p className="text-xs text-white/40 leading-relaxed">
              Po kliknięciu zostaniesz przekierowany do Telegram / WhatsApp z gotową
              wiadomością zawierającą Twoje zamówienie.
            </p>

            <div className="space-y-2">
              <a
                href={getTelegramLink(message)}
                target="_blank"
                rel="noreferrer"
                onClick={clearCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#4f46e5,#1d9bf0)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(79,70,229,0.4)] transition hover:brightness-110"
              >
                <Send size={16} />
                Zamów przez Telegram
              </a>
              <a
                href={getWhatsAppLink(message)}
                target="_blank"
                rel="noreferrer"
                onClick={clearCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/45 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
              >
                <MessageCircle size={16} />
                Zamów przez WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
