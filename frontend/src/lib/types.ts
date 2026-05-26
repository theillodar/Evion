export type Locale = "pl" | "uk" | "en";

export type ProductStatus = "in_stock" | "sold" | "reserved";

export type Product = {
  id: number;
  documentId?: string;
  slug: string;
  code: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  status: ProductStatus;
  shortDescription: string;
  description: string;
  specs?: Record<string, string>;
  images: string[];
  featured?: boolean;
};

export type Translation = {
  nav: {
    home: string;
    catalog: string;
    about: string;
    admin: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    text: string;
    ctaCatalog: string;
    ctaContact: string;
  };
  sections: {
    benefits: string;
    categories: string;
    popular: string;
    brands: string;
    cta: string;
  };
  catalog: {
    title: string;
    search: string;
    sortLabel: string;
    allCategories: string;
    allBrands: string;
    inStockOnly: string;
    noResults: string;
  };
  sort: {
    newest: string;
    priceAsc: string;
    priceDesc: string;
    nameAsc: string;
  };
  product: {
    code: string;
    price: string;
    oldPrice: string;
    status: string;
    description: string;
    specs: string;
    order: string;
    contact: string;
    backToCatalog: string;
  };
  status: {
    in_stock: string;
    sold: string;
    reserved: string;
  };
  admin: {
    title: string;
    subtitle: string;
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    empty: string;
  };
  footer: {
    rights: string;
  };
};
