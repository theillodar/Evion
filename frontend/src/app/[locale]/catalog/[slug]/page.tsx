import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButtons } from "@/components/contact-buttons";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImagesViewer } from "@/components/product-images-viewer";
import { formatPrice } from "@/lib/catalog";
import { translateCategoryName } from "@/lib/category-translations";
import { getProductBySlug } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "pl";
  const tr = t(safeLocale);

  const product = await getProductBySlug(slug, safeLocale);
  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
      <ProductImagesViewer images={product.images} productName={product.name} />

      <section className="card-glow space-y-5 p-6">
        <div>
          <p className="text-xs text-white/55">{product.brand} · {translateCategoryName(product.category, safeLocale)}</p>
          <h1 className="mt-2 font-heading text-3xl text-white">{product.name}</h1>
          <p className="mt-2 text-sm text-white/65">{tr.product.code}: {product.code}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold text-white">{formatPrice(product.price)}</span>
          {product.oldPrice ? <span className="text-sm text-white/40 line-through">{formatPrice(product.oldPrice)}</span> : null}
        </div>

        <div className="flex gap-3 text-sm">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/75">{tr.status[product.status]}</span>
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">{product.code}</span>
        </div>

        <div>
          <h2 className="text-white">{tr.product.description}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{product.description}</p>
        </div>

        {product.specs ? (
          <div>
            <h2 className="text-white">{tr.product.specs}</h2>
            <dl className="mt-2 space-y-2 text-sm text-white/75">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <ContactButtons product={product} tr={tr} />

        <AddToCartButton
          product={product}
          label="Dodaj do koszyka"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/15 px-5 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/25"
        />

        <Link href={`/${safeLocale}/catalog`} className="inline-flex text-sm text-blue-300 hover:text-blue-200">
          {tr.product.backToCatalog}
        </Link>
      </section>
    </div>
  );
}
