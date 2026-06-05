
"use client";

import { useEffect, useState } from "react";
import { AdminClient } from "@/components/admin-client";
import { getDefaultCategories } from "@/lib/default-categories";
import { isLocale, t } from "@/lib/i18n";
import { Locale, Translation } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

export default function AdminPage({ params }: Props) {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<Locale>("pl");
  const [tr, setTr] = useState<Translation | null>(null);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    let mounted = true;

    params.then(async ({ locale }) => {
      const safeLocale: Locale = isLocale(locale) ? locale : "pl";
      if (!mounted) return;

      setLocale(safeLocale);
      setTr(t(safeLocale));
      setCategories(Array.from(new Set(getDefaultCategories(safeLocale))).map((name, index) => ({ id: index + 1, name })));

      try {
        const sessionRes = await fetch("/api/admin/session", { cache: "no-store" });
        if (sessionRes.ok) {
          const sessionData = (await sessionRes.json()) as { authed?: boolean };
          if (mounted) {
            setAuthed(Boolean(sessionData.authed));
          }
        }
      } catch {
        if (mounted) {
          setAuthed(false);
        }
      }
      
      // Загрузить бренды с сервера
      try {
        const res = await fetch("/api/strapi/brands");
        if (res.ok) {
          const data = await res.json();
          const brandsList = Array.isArray(data?.data) ? data.data : [];
          if (mounted) {
            setBrands(
              brandsList.map((b: { id: number; attributes?: { name?: string }; name?: string }) => ({
                id: b.id,
                name: b.attributes?.name || b.name || "",
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to load brands:", error);
      }
    });

    return () => {
      mounted = false;
    };
  }, [params]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setAuthed(true);
        setEmail("");
        setPassword("");
        setError("");
      } else {
        setError("Неправильний email або пароль");
      }
    } catch {
      setError("Помилка входу. Спробуйте ще раз.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setAuthed(false);
      setEmail("");
      setPassword("");
      setError("");
    }
  };

  if (!tr) return null;

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-[#181c2e] p-8 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-xs">
          <h2 className="text-xl font-bold text-white mb-2">Вхід в адмін-панель</h2>
          <input
            type="text"
            className="rounded border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:ring focus:ring-blue-400"
            placeholder="Логін"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            className="rounded border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:ring focus:ring-blue-400"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold">Увійти</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-white">{tr.admin.title}</h1>
          <p className="mt-2 text-sm text-white/65">{tr.admin.subtitle}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-white/60 hover:text-white bg-white/10 rounded px-3 py-1">Вийти</button>
      </header>
      <AdminClient locale={locale} initialProducts={[]} initialBrands={brands} initialCategories={categories} tr={tr} />
    </div>
  );
}
