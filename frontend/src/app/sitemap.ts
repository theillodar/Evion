import type { MetadataRoute } from "next";
import { getCatalogData } from "@/lib/content";
import { defaultLocale, locales } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evionshop.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalogData(defaultLocale);

  const localeRoutes = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date() },
    { url: `${baseUrl}/${locale}/catalog`, lastModified: new Date() },
    { url: `${baseUrl}/${locale}/about`, lastModified: new Date() },
  ]);

  const productRoutes = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${baseUrl}/${locale}/catalog/${product.slug}`,
      lastModified: new Date(),
    }))
  );

  return [...localeRoutes, ...productRoutes];
}
