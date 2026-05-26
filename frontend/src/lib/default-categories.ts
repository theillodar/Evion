import { Locale } from "@/lib/types";

const DEFAULT_CATEGORIES_BY_LOCALE: Record<Locale, string[]> = {
  pl: [
    "Audio",
    "Telefony",
    "Komputery",
    "Akcesoria",
    "Urzadzenia",
    "AGD",
    "Dom",
    "Zegarki",
  ],
  uk: [
    "Аудіотехніка",
    "Телефони",
    "Комп'ютери",
    "Аксесуари",
    "Девайси",
    "Побутова техніка",
    "Дім",
    "Годинники",
  ],
  en: [
    "Audio",
    "Phones",
    "Computers",
    "Accessories",
    "Devices",
    "Home Appliances",
    "Home",
    "Watches",
  ],
};

export function getDefaultCategories(locale: Locale): string[] {
  return [...(DEFAULT_CATEGORIES_BY_LOCALE[locale] ?? DEFAULT_CATEGORIES_BY_LOCALE.pl)];
}
