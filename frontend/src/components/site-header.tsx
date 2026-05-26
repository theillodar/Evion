
"use client";
import React from "react";

import Link from "next/link";
import { Camera, Globe, MessageCircle, Send, ShoppingBag, ShoppingCart } from "lucide-react";

import { Locale, Translation } from "@/lib/types";
import { locales } from "@/lib/i18n";
import { socialLinks } from "@/lib/contact";
import { useCart } from "@/lib/cart-context";

type Props = {
  locale: Locale;
  tr: Translation;
};

export function SiteHeader({ locale, tr }: Props) {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b1f]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(140deg,#1d9bf0,#4f46e5)] shadow-[0_0_20px_rgba(29,155,240,0.45)]">
            <span className="font-heading text-lg font-extrabold italic leading-none text-white [text-shadow:0_1px_8px_rgba(255,255,255,0.4)]">
              E
            </span>
          </div>
          <span className="font-heading text-xl font-semibold tracking-wide text-white">EvionShop</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link className="hover:text-white" href={`/${locale}`}>
            {tr.nav.home}
          </Link>
          <Link className="hover:text-white" href={`/${locale}/catalog`}>
            {tr.nav.catalog}
          </Link>
          <Link className="hover:text-white" href={`/${locale}/about`}>
            {tr.nav.about}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a className="icon-btn" href={socialLinks.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
            <Send size={16} />
          </a>
          <a className="icon-btn" href={socialLinks.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <MessageCircle size={16} />
          </a>
          <a className="icon-btn" href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <Camera size={16} />
          </a>

          <div className="relative ml-2">
            <Globe size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
            <select
              className="rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-8 text-xs uppercase text-white/80 outline-none ring-blue-400 transition focus:ring"
              value={locale}
              onChange={(e) => {
                window.location.href = `/${e.target.value}`;
              }}
              aria-label="Language selector"
            >
              {locales.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/${locale}/catalog`}
            className="ml-1 hidden items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/80 sm:flex"
          >
            <ShoppingBag size={14} />
            Catalog
          </Link>

          <button
            onClick={openCart}
            className="relative ml-1 icon-btn"
            aria-label="Open cart"
          >
            <ShoppingCart size={16} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
