import { Locale } from "@/lib/types";

// Mapping from any language to all other languages
const categoryTranslationMap: Record<string, Record<Locale, string>> = {
  // English variants
  Audio: { pl: "Audio", uk: "Аудіотехніка", en: "Audio" },
  Phones: { pl: "Telefony", uk: "Телефони", en: "Phones" },
  Computers: { pl: "Komputery", uk: "Комп'ютери", en: "Computers" },
  Accessories: { pl: "Akcesoria", uk: "Аксесуари", en: "Accessories" },
  Devices: { pl: "Urzadzenia", uk: "Девайси", en: "Devices" },
  "Home Appliances": { pl: "AGD", uk: "Побутова техніка", en: "Home Appliances" },
  Home: { pl: "Dom", uk: "Дім", en: "Home" },
  Watches: { pl: "Zegarki", uk: "Годинники", en: "Watches" },

  // Polish variants
  Telefony: { pl: "Telefony", uk: "Телефони", en: "Phones" },
  Komputery: { pl: "Komputery", uk: "Комп'ютери", en: "Computers" },
  Akcesoria: { pl: "Akcesoria", uk: "Аксесуари", en: "Accessories" },
  Urzadzenia: { pl: "Urzadzenia", uk: "Девайси", en: "Devices" },
  AGD: { pl: "AGD", uk: "Побутова техніка", en: "Home Appliances" },
  Dom: { pl: "Dom", uk: "Дім", en: "Home" },
  Zegarki: { pl: "Zegarki", uk: "Годинники", en: "Watches" },

  // Ukrainian variants
  Аудіотехніка: { pl: "Audio", uk: "Аудіотехніка", en: "Audio" },
  Телефони: { pl: "Telefony", uk: "Телефони", en: "Phones" },
  "Комп'ютери": { pl: "Komputery", uk: "Комп'ютери", en: "Computers" },
  Аксесуари: { pl: "Akcesoria", uk: "Аксесуари", en: "Accessories" },
  Девайси: { pl: "Urzadzenia", uk: "Девайси", en: "Devices" },
  "Побутова техніка": { pl: "AGD", uk: "Побутова техніка", en: "Home Appliances" },
  Дім: { pl: "Dom", uk: "Дім", en: "Home" },
  Годинники: { pl: "Zegarki", uk: "Годинники", en: "Watches" },
};

export function translateCategoryName(categoryName: string, targetLocale: Locale): string {
  const translationEntry = categoryTranslationMap[categoryName];
  if (translationEntry) {
    return translationEntry[targetLocale];
  }
  // If no translation found, return the original name
  return categoryName;
}
