import Link from "next/link";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CategoryCard } from "@/components/category-card";
import { SafeImage } from "@/components/safe-image";
import { getCatalogData } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "pl";
  const tr = t(safeLocale);
  const { products, categories, brands } = await getCatalogData(safeLocale);

  // Newest products for hero box (sorted by id descending)
  const newest = [...products].sort((a, b) => b.id - a.id).slice(0, 4);
  // Featured for popular section
  const featured = products.filter((item) => item.featured).slice(0, 4).length > 0
    ? products.filter((item) => item.featured).slice(0, 4)
    : newest;

  return (
    <div className="space-y-10 pb-6">
      <section className="hero-grid overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-10">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-blue-400/40 bg-blue-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-blue-300">
            EvionShop
          </p>
          <h1 className="font-heading text-3xl font-semibold text-white sm:text-5xl">{tr.hero.title}</h1>
          <p className="text-lg text-blue-200/90">{tr.hero.subtitle}</p>
          <p className="max-w-xl text-sm leading-relaxed text-white/70">{tr.hero.text}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${safeLocale}/catalog`} className="btn-primary">
              {tr.hero.ctaCatalog}
            </Link>
            <Link href={`/${safeLocale}/about`} className="btn-secondary">
              {tr.hero.ctaContact}
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] rounded-2xl border border-white/10 bg-[#080d26]/70 p-4">
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_20%,rgba(45,117,255,0.25),transparent_40%),radial-gradient(circle_at_30%_80%,rgba(79,70,229,0.2),transparent_45%)]" />
          <p className="relative mb-3 text-xs uppercase tracking-[0.15em] text-blue-300/80">Najnowsze</p>
          <div className="relative grid grid-cols-2 gap-2">
            {newest.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center h-32 text-xs text-white/30">Brak produktów</div>
            ) : (
              newest.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/${safeLocale}/catalog/${item.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 hover:border-blue-400/30"
                >
                  {item.images[0] ? (
                    <div className="relative mb-2 h-16 w-full overflow-hidden rounded-lg border border-white/10 bg-black/30">
                      <SafeImage
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ) : (
                    <div className="mb-2 h-16 w-full rounded-lg border border-white/10 bg-white/5" />
                  )}
                  <p className="line-clamp-1 text-xs text-white/80 group-hover:text-white">{item.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-blue-300">{item.price > 0 ? `${item.price} zł` : item.code}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{tr.sections.benefits}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-glow p-5">
            <ShieldCheck className="text-blue-300" />
            <p className="mt-3 text-white">Quality checked</p>
            <p className="mt-2 text-sm text-white/60">Every product is tested before listing.</p>
          </div>
          <div className="card-glow p-5">
            <Truck className="text-blue-300" />
            <p className="mt-3 text-white">Fast delivery</p>
            <p className="mt-2 text-sm text-white/60">Quick shipping across Poland.</p>
          </div>
          <div className="card-glow p-5">
            <Sparkles className="text-blue-300" />
            <p className="mt-3 text-white">Modern devices</p>
            <p className="mt-2 text-sm text-white/60">Trending electronics at better prices.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{tr.sections.categories}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((item, index) => (
            <CategoryCard key={item} name={item} locale={safeLocale} index={index} delay={index * 0.08} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{tr.sections.popular}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((item, index) => (
            <ProductCard
              key={item.id}
              locale={safeLocale}
              product={item}
              tr={tr}
              delay={index * 0.1}
              priorityImage={index < 2}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">{tr.sections.brands}</h2>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Link key={brand} href={`/${safeLocale}/catalog?brand=${encodeURIComponent(brand)}`} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <section className="card-glow flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">CTA</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{tr.sections.cta}</h2>
        </div>
        <Link href={`/${safeLocale}/catalog`} className="btn-primary">
          {tr.hero.ctaCatalog}
        </Link>
      </section>
    </div>
  );
}
