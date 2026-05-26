import { Locale, Translation } from "@/lib/types";

export const locales: Locale[] = ["pl", "uk", "en"];

export const defaultLocale: Locale = "pl";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const translations: Record<Locale, Translation> = {
  pl: {
    nav: {
      home: "Glowna",
      catalog: "Katalog",
      about: "O nas",
      admin: "Admin",
      contact: "Kontakt",
    },
    hero: {
      title: "Technologia nowej generacji",
      subtitle: "Sprawdzone produkty z Amazon Returns",
      text: "Innowacyjna elektronika, testowana i gotowa do wysylki w Polsce.",
      ctaCatalog: "Przejdz do katalogu",
      ctaContact: "Skontaktuj sie",
    },
    sections: {
      benefits: "Dlaczego EvionShop",
      categories: "Kategorie",
      popular: "Popularne produkty",
      brands: "Marki",
      cta: "Potrzebujesz pomocy z wyborem?",
    },
    catalog: {
      title: "Katalog",
      search: "Szukaj produktu...",
      sortLabel: "Sortowanie",
      allCategories: "Wszystkie kategorie",
      allBrands: "Wszystkie marki",
      inStockOnly: "Tylko dostepne",
      noResults: "Brak produktow spelniajacych kryteria.",
    },
    sort: {
      newest: "Najnowsze",
      priceAsc: "Cena rosnaco",
      priceDesc: "Cena malejaco",
      nameAsc: "Nazwa A-Z",
    },
    product: {
      code: "Kod",
      price: "Cena",
      oldPrice: "Cena regularna",
      status: "Status",
      description: "Opis",
      specs: "Specyfikacja",
      order: "Zamow",
      contact: "Skontaktuj sie",
      backToCatalog: "Powrot do katalogu",
    },
    status: {
      in_stock: "Dostepny",
      sold: "Sprzedany",
      reserved: "Rezerwacja",
    },
    admin: {
      title: "Panel Administracyjny",
      subtitle: "Zarzadzaj produktami, kategoriami i markami.",
      add: "Dodaj produkt",
      edit: "Edytuj",
      delete: "Usun",
      save: "Zapisz",
      cancel: "Anuluj",
      empty: "Brak produktow.",
    },
    footer: {
      rights: "Wszelkie prawa zastrzezone.",
    },
  },
  uk: {
    nav: {
      home: "Головна",
      catalog: "Katalog",
      about: "Про нас",
      admin: "Admin",
      contact: "Kontakt",
    },
    hero: {
      title: "Техніка нового покоління",
      subtitle: "Перевірені товари з Amazon Returns",
      text: "Якісна електроніка після тестів, готова до відправки по Польщі.",
      ctaCatalog: "Перейти до каталогу",
      ctaContact: "Зв'язатися",
    },
    sections: {
      benefits: "Чому EvionShop",
      categories: "Категорії",
      popular: "Популярні товари",
      brands: "Бренди",
      cta: "Потрібна допомога з вибором?",
    },
    catalog: {
      title: "Katalog",
      search: "Пошук товару...",
      sortLabel: "Сортування",
      allCategories: "Усі категорії",
      allBrands: "Усі бренди",
      inStockOnly: "Тільки в наявності",
      noResults: "Немає товарів за обраними фільтрами.",
    },
    sort: {
      newest: "Спочатку нові",
      priceAsc: "Ціна за зростанням",
      priceDesc: "Ціна за спаданням",
      nameAsc: "Назва A-Z",
    },
    product: {
      code: "Код",
      price: "Ціна",
      oldPrice: "Стара ціна",
      status: "Status",
      description: "Опис",
      specs: "Характеристики",
      order: "Замовити",
      contact: "Зв'язатися",
      backToCatalog: "Назад до каталогу",
    },
    status: {
      in_stock: "В наявності",
      sold: "Продано",
      reserved: "Резерв",
    },
    admin: {
      title: "Адмін-панель",
      subtitle: "Керуйте товарами, категоріями та брендами.",
      add: "Додати товар",
      edit: "Редагувати",
      delete: "Видалити",
      save: "Зберегти",
      cancel: "Скасувати",
      empty: "Товари відсутні.",
    },
    footer: {
      rights: "Усі права захищені.",
    },
  },
  en: {
    nav: {
      home: "Home",
      catalog: "Catalog",
      about: "About",
      admin: "Admin",
      contact: "Contact",
    },
    hero: {
      title: "Next-Generation Tech",
      subtitle: "Verified products from Amazon Returns",
      text: "Curated electronics, quality-checked and ready for fast delivery in Poland.",
      ctaCatalog: "Browse catalog",
      ctaContact: "Contact manager",
    },
    sections: {
      benefits: "Why EvionShop",
      categories: "Categories",
      popular: "Popular products",
      brands: "Brands",
      cta: "Need help choosing?",
    },
    catalog: {
      title: "Catalog",
      search: "Search products...",
      sortLabel: "Sort",
      allCategories: "All categories",
      allBrands: "All brands",
      inStockOnly: "In stock only",
      noResults: "No products match your filters.",
    },
    sort: {
      newest: "Newest first",
      priceAsc: "Price low to high",
      priceDesc: "Price high to low",
      nameAsc: "Name A-Z",
    },
    product: {
      code: "Code",
      price: "Price",
      oldPrice: "Regular price",
      status: "Status",
      description: "Description",
      specs: "Specifications",
      order: "Order",
      contact: "Contact",
      backToCatalog: "Back to catalog",
    },
    status: {
      in_stock: "In stock",
      sold: "Sold",
      reserved: "Reserved",
    },
    admin: {
      title: "Admin Panel",
      subtitle: "Manage products, categories, and brands.",
      add: "Add product",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      empty: "No products yet.",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
};

export function t(locale: Locale): Translation {
  return translations[locale] ?? translations[defaultLocale];
}
