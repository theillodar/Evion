"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Save, Trash2, X, Upload } from "lucide-react";
import { getDefaultCategories } from "@/lib/default-categories";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { Product, ProductStatus, Translation } from "@/lib/types";

type Draft = {
  id?: number;
  documentId?: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  discountPercent: string;
  status: ProductStatus;
  code: string;
  images: Array<{ id?: number; url: string; file?: File }>;
};

type Props = {
  locale: string;
  initialProducts: Product[];
  initialBrands: Array<{ id: number; name: string }>;
  initialCategories: Array<{ id: number; name: string }>;
  tr: Translation;
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const ADMIN_API_BASE = "/api/strapi";

function parseRelationLabel(value: any): string {
  return value?.data?.attributes?.name || value?.data?.name || value?.attributes?.name || value?.name || "";
}

function parseImagesFromProduct(raw: any): string[] {
  const relation = raw?.images;
  if (!relation) return [];

  if (Array.isArray(relation)) {
    return relation
      .map((img) => img?.url || img?.attributes?.url)
      .filter(Boolean)
      .map((url) => (String(url).startsWith("http") ? String(url) : `${STRAPI_URL}${String(url)}`));
  }

  const relationData = relation?.data;
  if (!relationData) return [];

  const list = Array.isArray(relationData) ? relationData : [relationData];
  return list
    .map((img) => img?.url || img?.attributes?.url)
    .filter(Boolean)
    .map((url) => (String(url).startsWith("http") ? String(url) : `${STRAPI_URL}${String(url)}`));
}

function parseNameEntity(entry: any): { id: number; name: string } {
  return {
    id: Number(entry?.id ?? 0),
    name: entry?.attributes?.name || entry?.name || "",
  };
}

async function readApiError(response: Response, fallback: string): Promise<string> {
  const statusText = `HTTP ${response.status}`;
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      const message = payload?.error?.message || payload?.error || payload?.message;
      if (typeof message === "string" && message.trim()) {
        return `${message} (${statusText})`;
      }
    } else {
      const text = (await response.text()).trim();
      if (text && !text.startsWith("<!DOCTYPE") && !text.startsWith("<html")) {
        return `${text.slice(0, 240)} (${statusText})`;
      }
    }
    return `${fallback} (${statusText})`;
  } catch {
    return `${fallback} (${statusText})`;
  }
}

export function AdminClient({ locale, initialProducts, initialBrands, initialCategories, tr }: Props) {
  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState(initialBrands);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [imagePreviews, setImagePreviews] = useState<Array<string>>([]);
  const [draft, setDraft] = useState<Draft>({
    name: "",
    brand: "",
    category: "",
    price: "",
    discountPercent: "",
    status: "in_stock",
    code: "",
    images: [],
  });

  // Handle file selection for images
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newImages: Array<{ url: string; file: File }> = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
      newImages.push({ url, file });
    });

    setDraft((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Fetch data from Strapi on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          fetch(`${ADMIN_API_BASE}/products?populate=*&publicationState=preview&pagination[pageSize]=200`).catch(() => null),
          fetch(`${ADMIN_API_BASE}/brands`).catch(() => null),
          fetch(`${ADMIN_API_BASE}/categories`).catch(() => null),
        ]);

        if (productsRes?.ok) {
          const data = await productsRes.json();
          const products = data.data?.map((item: any) => {
            const source = item?.attributes ?? item;
            const name = String(source?.name ?? "").trim();
            const slug = String(source?.slug ?? "").trim();

            return {
              id: Number(item?.id ?? source?.id ?? Date.now()),
              documentId: String(item?.documentId ?? source?.documentId ?? "") || undefined,
              slug: slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
              code: String(source?.code ?? ""),
              name,
              brand: parseRelationLabel(source?.brand),
              category: parseRelationLabel(source?.category),
              price: Number(source?.price ?? 0),
              oldPrice:
                source?.oldPrice === null || source?.oldPrice === undefined
                  ? undefined
                  : Number(source?.oldPrice),
              status: (source?.status || "in_stock") as ProductStatus,
              description: String(source?.description ?? ""),
              shortDescription: String(source?.shortDescription ?? ""),
              images: parseImagesFromProduct(source),
            };
          }).filter((item: Product) => Boolean(item.name)) || [];
          setItems(products);
        }

        if (brandsRes?.ok) {
          const data = await brandsRes.json();
          const parsedBrands = (data.data || []).map(parseNameEntity).filter((entry: { id: number; name: string }) => Boolean(entry.name));
          if (parsedBrands.length > 0) {
            setBrands(parsedBrands);
          }
        }

        if (categoriesRes?.ok) {
          const data = await categoriesRes.json();
          const parsedCategories = (data.data || []).map(parseNameEntity).filter((entry: { id: number; name: string }) => Boolean(entry.name));
          if (parsedCategories.length > 0) {
            setCategories(parsedCategories);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const canSave = useMemo(() => {
    return draft.name && draft.brand && draft.category && Number(draft.price) > 0;
  }, [draft]);

  const effectiveBrands = useMemo(() => {
    if (brands.length > 0) {
      return brands;
    }

    const fromItems = Array.from(new Set(items.map((item) => item.brand).filter(Boolean)));
    return fromItems.map((name, index) => ({ id: index + 1, name }));
  }, [brands, items]);

  const effectiveCategories = useMemo(() => {
    const byName = new Map<string, { id: number; name: string }>();

    for (const name of getDefaultCategories(safeLocale)) {
      byName.set(name.toLowerCase(), {
        id: byName.size + 1,
        name,
      });
    }

    for (const entry of categories) {
      const normalized = entry.name.trim();
      if (!normalized) continue;
      const key = normalized.toLowerCase();
      if (!byName.has(key)) {
        byName.set(key, {
          id: byName.size + 1,
          name: normalized,
        });
      }
    }

    for (const name of items.map((item) => item.category).filter(Boolean)) {
      const normalized = String(name).trim();
      if (!normalized) continue;
      const key = normalized.toLowerCase();
      if (!byName.has(key)) {
        byName.set(key, {
          id: byName.size + 1,
          name: normalized,
        });
      }
    }

    return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, items, safeLocale]);

  const resetDraft = () => {
    setDraft({
      id: undefined,
      documentId: undefined,
      name: "",
      brand: "",
      category: "",
      price: "",
      discountPercent: "",
      status: "in_stock",
      code: "",
      images: [],
    });
    setImagePreviews([]);
    setError("");
    setNotice("");
  };

  const uploadImages = async (files: File[]): Promise<number[]> => {
    const uploadedIds: number[] = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append("files", file);

      try {
        const res = await fetch(`${ADMIN_API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(await readApiError(res, "Failed to upload image"));
        }

        const uploaded = await res.json();
        const list = Array.isArray(uploaded) ? uploaded : Array.isArray(uploaded?.data) ? uploaded.data : [];
        const first = list[0];
        const imageId = Number(first?.id ?? 0);
        if (imageId > 0) {
          uploadedIds.push(imageId);
        } else {
          throw new Error("Upload succeeded but image ID was not returned");
        }
      } catch (err) {
        throw err instanceof Error ? err : new Error("Image upload failed");
      }
    }

    return uploadedIds;
  };

  const ensureEntityId = async (
    collection: "brands" | "categories",
    name: string
  ): Promise<number | undefined> => {
    const normalized = name.trim();
    if (!normalized) return undefined;

    const filterQuery = `filters[name][$eqi]=${encodeURIComponent(normalized)}&pagination[pageSize]=1`;
    const findRes = await fetch(`${ADMIN_API_BASE}/${collection}?${filterQuery}`);

    if (findRes.ok) {
      const foundPayload = await findRes.json();
      const found = Array.isArray(foundPayload?.data) ? foundPayload.data[0] : undefined;
      const foundId = Number(found?.id ?? 0);
      if (foundId > 0) {
        return foundId;
      }
    }

    const createRes = await fetch(`${ADMIN_API_BASE}/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { name: normalized } }),
    });

    if (!createRes.ok) {
      throw new Error(
        await readApiError(
          createRes,
          `Failed to create ${collection === "brands" ? "brand" : "category"}`
        )
      );
    }

    const createdPayload = await createRes.json();
    const createdId = Number(createdPayload?.data?.id ?? 0);
    if (createdId > 0) {
      if (collection === "brands") {
        setBrands((prev) => {
          if (prev.some((entry) => entry.name.toLowerCase() === normalized.toLowerCase())) return prev;
          return [...prev, { id: createdId, name: normalized }];
        });
      } else {
        setCategories((prev) => {
          if (prev.some((entry) => entry.name.toLowerCase() === normalized.toLowerCase())) return prev;
          return [...prev, { id: createdId, name: normalized }];
        });
      }
    }

    return createdId > 0 ? createdId : undefined;
  };

  const saveProduct = async () => {
    if (!canSave) return;

    setLoading(true);
    setError("");

    try {
      // Upload new image files
      const filesToUpload = draft.images.filter((img) => img.file);
      let uploadedImageIds: number[] = [];

      if (filesToUpload.length > 0) {
        uploadedImageIds = await uploadImages(filesToUpload.map((img) => img.file!));
      }

      // Resolve relations against Strapi (create brand/category if missing).
      const [brandId, categoryId] = await Promise.all([
        ensureEntityId("brands", draft.brand),
        ensureEntityId("categories", draft.category),
      ]);

      const basePrice = Number(draft.price);
      const parsedDiscount = Number(draft.discountPercent || 0);
      const normalizedDiscount = Math.min(90, Math.max(0, Number.isFinite(parsedDiscount) ? parsedDiscount : 0));
      const hasDiscount = normalizedDiscount > 0;
      const finalPrice = hasDiscount ? Math.max(1, Math.round(basePrice * (1 - normalizedDiscount / 100))) : basePrice;

      const payload = {
        data: {
          name: draft.name,
          slug: draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          price: finalPrice,
          oldPrice: hasDiscount ? basePrice : null,
          status: draft.status,
          description: draft.name,
          shortDescription: draft.name,
          brand: brandId,
          category: categoryId,
          images: uploadedImageIds.length > 0 ? uploadedImageIds : undefined,
          locale,
          publishedAt: new Date().toISOString(),
        },
      };

      if (draft.id) {
        const targetId = draft.documentId || String(draft.id);
        // Update product
        const res = await fetch(`${ADMIN_API_BASE}/products/${targetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(await readApiError(res, "Failed to update product"));
        }

        const updated = await res.json();
        const updatedData = updated?.data?.attributes || updated?.data || {};

        setItems((prev) =>
          prev.map((item) =>
            item.id === draft.id
              ? {
                  ...item,
                  name: updatedData.name || draft.name,
                  brand: draft.brand,
                  category: draft.category,
                  price: Number(updatedData.price ?? finalPrice),
                  oldPrice:
                    updatedData.oldPrice === null || updatedData.oldPrice === undefined
                      ? (hasDiscount ? basePrice : undefined)
                      : Number(updatedData.oldPrice),
                  status: (updatedData.status || draft.status) as ProductStatus,
                }
              : item
          )
        );
      } else {
        // Create product
        const res = await fetch(`${ADMIN_API_BASE}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(await readApiError(res, "Failed to create product"));
        }

        const created = await res.json();
        const createdData = created?.data?.attributes || created?.data || {};

        setItems((prev) => [
          {
            id: created?.data?.id || Date.now(),
            documentId: created?.data?.documentId || createdData.documentId,
            slug: createdData.slug || `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
            code: createdData.code || `AMZ-${Date.now()}`,
            name: createdData.name || draft.name,
            brand: draft.brand,
            category: draft.category,
            price: Number(createdData.price ?? finalPrice),
            oldPrice:
              createdData.oldPrice === null || createdData.oldPrice === undefined
                ? (hasDiscount ? basePrice : undefined)
                : Number(createdData.oldPrice),
            status: (createdData.status || draft.status) as ProductStatus,
            description: createdData.description || draft.name,
            shortDescription: createdData.shortDescription || draft.name,
            images: (createdData.images?.data || []).map((img: any) => `${STRAPI_URL}${img.attributes?.url || ""}`),
          },
          ...prev,
        ]);
      }

      resetDraft();
    } catch (err) {
      if (draft.id) {
        // Fallback: keep admin functional even if Strapi update endpoint is unavailable.
        setItems((prev) =>
          prev.map((item) =>
            item.id === draft.id
              ? {
                  ...item,
                  name: draft.name,
                  brand: draft.brand,
                  category: draft.category,
                  price: Number(draft.price),
                  oldPrice: Number(draft.discountPercent) > 0 ? Number(draft.price) : undefined,
                  status: draft.status,
                }
              : item
          )
        );
        resetDraft();
        setError(
          err instanceof Error
            ? `${err.message}. Updated locally only.`
            : "Updated locally only. API update failed."
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    const previousItems = items;
    setItems((prev) => prev.filter((item) => item.id !== id));

    const target = items.find((item) => item.id === id);
    const targetId = target?.documentId || String(id);

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${ADMIN_API_BASE}/products/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let details = "";
        try {
          const payload = await res.json();
          details = payload?.error?.message || payload?.message || "";
        } catch {
          details = "";
        }
        throw new Error(details || `Failed to delete product (HTTP ${res.status})`);
      }

      if (draft.id === id) {
        resetDraft();
      }
    } catch (err) {
      setItems(previousItems);
      setError(
        err instanceof Error
          ? err.message
          : "Deleted locally. API delete failed: check Strapi permissions for products.delete and CMS status."
      );
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id: number, status: ProductStatus) => {
    try {
      const target = items.find((item) => item.id === id);
      const targetId = target?.documentId || String(id);

      const res = await fetch(`${ADMIN_API_BASE}/products/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status } }),
      });

      if (res.ok) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const editProduct = (item: Product) => {
    setDraft({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: String(item.price),
      discountPercent:
        item.oldPrice && item.oldPrice > item.price
          ? String(Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100))
          : "",
      status: item.status,
      code: item.code,
      images: item.images.map((url) => ({ url })),
    });
    setImagePreviews(item.images);
  };

  const addBrand = async () => {
    if (loading) return;
    const normalized = draft.brand.trim();
    if (!normalized) {
      setError("Type brand name first");
      setNotice("");
      return;
    }

    const existing = effectiveBrands.find((entry) => entry.name.toLowerCase() === normalized.toLowerCase());
    if (existing) {
      setDraft((prev) => ({ ...prev, brand: existing.name }));
      setError("");
      setNotice(`Brand \"${existing.name}\" already exists`);
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      await ensureEntityId("brands", draft.brand);
      setNotice(`Brand \"${normalized}\" added`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add brand");
      setNotice("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
      <section className="card-glow space-y-3 p-5">
        <h2 className="text-lg text-white">{draft.id ? tr.admin.edit : tr.admin.add}</h2>
        
        {error && <div className="rounded bg-red-500/20 p-2 text-sm text-red-300">{error}</div>}
        {notice && <div className="rounded bg-emerald-500/20 p-2 text-sm text-emerald-300">{notice}</div>}

        <input
          className="field"
          placeholder="Product Name"
          value={draft.name}
          onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
          disabled={loading}
        />

        <div className="relative">
          <input
            className="field"
            list="brands-list"
            placeholder="Select or type Brand"
            value={draft.brand}
            onChange={(e) => {
              setDraft((p) => ({ ...p, brand: e.target.value }));
              setError("");
              setNotice("");
            }}
            disabled={loading}
            autoComplete="off"
          />
          <datalist id="brands-list">
            {effectiveBrands.map((b) => (
              <option key={b.id} value={b.name} />
            ))}
          </datalist>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={addBrand}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={12} />
              Add brand
            </button>
          </div>
        </div>

        <div className="relative">
          <input
            className="field"
            list="categories-list"
            placeholder="Select or type Category"
            value={draft.category}
            onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
            disabled={loading}
            autoComplete="off"
          />
          <datalist id="categories-list">
            {effectiveCategories.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </div>

        <input
          className="field"
          type="number"
          placeholder="Price"
          value={draft.price}
          onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
          disabled={loading}
        />

        <input
          className="field"
          type="number"
          min={0}
          max={90}
          placeholder="Discount % (optional)"
          value={draft.discountPercent}
          onChange={(e) => setDraft((p) => ({ ...p, discountPercent: e.target.value }))}
          disabled={loading}
        />

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="field flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition">
            <Upload size={16} />
            <span className="text-sm">Add Photos</span>
            <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" disabled={loading} />
          </label>

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${idx}`} 
                    className="h-24 w-24 object-contain rounded border border-white/20 bg-white/5" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded"
                    disabled={loading}
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="field flex items-center justify-between text-sm text-white/70">
          <span>Status</span>
          <select
            value={draft.status}
            onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value as ProductStatus }))}
            className="bg-[#060a1f] text-white outline-none rounded-lg px-2 py-1"
            disabled={loading}
          >
            <option value="in_stock">{tr.status.in_stock}</option>
            <option value="reserved">{tr.status.reserved}</option>
            <option value="sold">{tr.status.sold}</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveProduct}
            disabled={!canSave || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#4f46e5,#1d9bf0)] px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {draft.id ? <Pencil size={16} /> : <Plus size={16} />}
            <Save size={16} />
            {tr.admin.save}
          </button>
          {draft.id ? (
            <button
              onClick={resetDraft}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80 disabled:opacity-60"
              disabled={loading}
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </section>

      <section className="card-glow overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-wide text-white/40">
          <span>Product</span>
          <span>Code</span>
          <span>Status</span>
          <span>Edit</span>
          <span>Action</span>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-white/60">{tr.admin.empty}</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 border-b border-white/10 px-4 py-3 text-sm text-white/85 hover:bg-white/5 transition">
              <div>
                <p>{item.name}</p>
                <p className="text-xs text-white/50">
                  {item.brand} · {item.category}
                </p>
              </div>
              <span className="text-xs text-white/60">{item.code}</span>
              <select
                value={item.status}
                onChange={(e) => changeStatus(item.id, e.target.value as ProductStatus)}
                className="rounded-lg border border-white/20 bg-[#060a1f] px-2 py-1 text-xs text-white disabled:opacity-60"
                disabled={loading}
              >
                <option value="in_stock">{tr.status.in_stock}</option>
                <option value="reserved">{tr.status.reserved}</option>
                <option value="sold">{tr.status.sold}</option>
              </select>
              <button
                className="icon-btn disabled:opacity-60"
                onClick={() => editProduct(item)}
                aria-label={`Edit ${item.name}`}
                disabled={loading}
              >
                <Pencil size={15} />
              </button>
              <button
                className="icon-btn disabled:opacity-60"
                onClick={() => removeProduct(item.id)}
                aria-label={`Delete ${item.name}`}
                disabled={loading}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
