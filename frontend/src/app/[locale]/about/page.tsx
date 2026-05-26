import { Building2, MapPin, Package, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { isLocale, t } from "@/lib/i18n";
import { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: Locale = isLocale(locale) ? locale : "pl";
  const tr = t(safeLocale);
  const copy =
    safeLocale === "uk"
      ? {
          intro:
            "EvionShop — магазин, що спеціалізується на електроніці з палет Amazon Returns. Ми купуємо товар напряму зі складів Amazon у Європі цілими палетами, потім перевіряємо кожен продукт перед продажем. Завдяки цьому пропонуємо перевірену брендову електроніку за цінами нижче ринкових.",
          stats: [
            ["Ціни нижче ринку", "На 20-40% дешевше"],
            ["500+ товарів", "В асортименті щомісяця"],
            ["10 000+ клієнтів", "Нам уже довіряють"],
          ] as const,
          howLabel: "Як це працює",
          howTitle: "Від Amazon до вас",
          steps: [
            ["Купівля палет з Amazon", "Купуємо повернення з європейських складів Amazon великими партіями за вигідними цінами."],
            ["Перевірка кожного товару", "Кожен пристрій тестується та описується — ви знаєте стан до покупки."],
            ["Швидка доставка або самовивіз", "Доставляємо по Польщі кур'єром або можна забрати особисто."],
          ] as const,
          findUs: "Знайдіть нас",
          addressTitle: "Наша адреса",
          addressText: "Запрошуємо на самовивіз. Ви також можете оглянути товар на місці перед покупкою.",
          country: "Польща",
          maps: "Відкрити у Google Maps",
          whyUs: "Чому ми",
          benefitsTitle: "Наші переваги",
          benefits: [
            ["Перевірена техніка", "Кожен товар тестується перед публікацією — без сюрпризів."],
            ["Доставка по всій Польщі", "Швидка відправка кур'єром або самовивіз."],
            ["Ціни нижче ринку", "Брендова електроніка з Amazon за цінами на 30-70% нижчими, ніж у магазинах."],
            ["Унікальний код товару", "Кожен товар має індивідуальний код — зручно для оформлення замовлення."],
          ] as const,
        }
      : safeLocale === "en"
        ? {
            intro:
              "EvionShop specializes in electronics from Amazon Returns pallets. We buy stock directly from Amazon warehouses in Europe by full pallets and inspect every item before sale. This lets us offer verified branded electronics at prices well below market average.",
            stats: [
              ["Below-market prices", "20-40% cheaper"],
              ["500+ products", "In stock monthly"],
              ["10,000+ clients", "Already trust us"],
            ] as const,
            howLabel: "How it works",
            howTitle: "From Amazon to You",
            steps: [
              ["Buying Amazon pallets", "We buy returns from Amazon warehouses in Europe in bulk at very competitive prices."],
              ["Inspection of every item", "Every device is tested and documented so you know the condition before purchase."],
              ["Fast shipping or pickup", "We ship across Poland or you can pick up your order in person."],
            ] as const,
            findUs: "Find us",
            addressTitle: "Our address",
            addressText: "You are welcome to pick up your order in person and inspect devices on-site before purchase.",
            country: "Poland",
            maps: "Open in Google Maps",
            whyUs: "Why us",
            benefitsTitle: "Our advantages",
            benefits: [
              ["Verified devices", "Every item is tested before listing so there are no surprises."],
              ["Delivery across Poland", "Fast courier delivery or in-store pickup."],
              ["Below-market pricing", "Branded electronics from Amazon at prices 30-70% lower than regular stores."],
              ["Unique product code", "Each item has an individual code for quick and clear order processing."],
            ] as const,
          }
        : {
            intro:
              "EvionShop — to sklep specjalizujący się w elektronice z palet Amazon Returns. Kupujemy towar bezpośrednio z magazynów Amazon w Europie całymi paletami, a następnie sprawdzamy każdy produkt indywidualnie przed sprzedażą. Dzięki temu oferujemy sprawdzoną elektronikę markową w cenach znacznie poniżej rynkowych.",
            stats: [
              ["Ceny niższe od rynkowych", "Taniej o 20-40%"],
              ["500+ produktów", "W ofercie co miesiąc"],
              ["10 000+ klientów", "Zaufało nam już"],
            ] as const,
            howLabel: "Jak to działa",
            howTitle: "Od Amazona do Ciebie",
            steps: [
              ["Zakup palet z Amazona", "Kupujemy zwroty z europejskich magazynów Amazon w dużych ilościach po bardzo atrakcyjnych cenach."],
              ["Inspekcja każdego produktu", "Każde urządzenie jest testowane i opisywane - znasz stan przed zakupem."],
              ["Szybka wysyłka lub odbiór", "Dostarczamy kurierem po Polsce lub możesz odebrać osobiście u nas."],
            ] as const,
            findUs: "Znajdź nas",
            addressTitle: "Nasz adres",
            addressText: "Zapraszamy do odbioru osobistego. Możesz również obejrzeć sprzęt na miejscu przed zakupem.",
            country: "Polska",
            maps: "Otwórz w Google Maps",
            whyUs: "Dlaczego my",
            benefitsTitle: "Nasze zalety",
            benefits: [
              ["Sprawdzony sprzęt", "Każdy produkt testowany przed wystawieniem - zero niespodzianek."],
              ["Dostawa po całej Polsce", "Szybka wysyłka kurierem lub odbiór osobisty."],
              ["Ceny poniżej rynku", "Elektronika markowa z Amazona w cenach o 30-70% niższych niż w sklepach."],
              ["Unikalny kod produktu", "Każdy towar posiada indywidualny kod - łatwa komunikacja przy zamówieniu."],
            ] as const,
          };

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <section className="card-glow space-y-5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">{tr.nav.about}</p>
          <h1 className="font-heading text-3xl text-white">{tr.hero.title}</h1>
          <p className="text-sm leading-relaxed text-white/70">{copy.intro}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
              <ShieldCheck size={18} className="text-blue-300" />
              <p className="mt-2 text-sm font-medium text-white">{copy.stats[0][0]}</p>
              <p className="mt-1 text-xs text-white/55">{copy.stats[0][1]}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
              <Sparkles size={18} className="text-blue-300" />
              <p className="mt-2 text-sm font-medium text-white">{copy.stats[1][0]}</p>
              <p className="mt-1 text-xs text-white/55">{copy.stats[1][1]}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-white/80">
              <Building2 size={18} className="text-blue-300" />
              <p className="mt-2 text-sm font-medium text-white">{copy.stats[2][0]}</p>
              <p className="mt-1 text-xs text-white/55">{copy.stats[2][1]}</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(130deg,#0a102e,#111d4a)] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(48,111,255,.35),transparent_44%),radial-gradient(circle_at_20%_70%,rgba(79,70,229,.28),transparent_42%)]" />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-300">{copy.howLabel}</p>
            <h2 className="font-heading text-xl text-white">{copy.howTitle}</h2>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-xs font-bold text-blue-300">1</span>
                <div>
                  <p className="text-sm font-medium text-white">{copy.steps[0][0]}</p>
                  <p className="mt-0.5 text-xs text-white/55">{copy.steps[0][1]}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-xs font-bold text-blue-300">2</span>
                <div>
                  <p className="text-sm font-medium text-white">{copy.steps[1][0]}</p>
                  <p className="mt-0.5 text-xs text-white/55">{copy.steps[1][1]}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-xs font-bold text-blue-300">3</span>
                <div>
                  <p className="text-sm font-medium text-white">{copy.steps[2][0]}</p>
                  <p className="mt-0.5 text-xs text-white/55">{copy.steps[2][1]}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Location + Contact */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Address card */}
        <section className="card-glow space-y-4 p-6">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-blue-300" />
            <p className="text-xs uppercase tracking-[0.18em] text-blue-300">{copy.findUs}</p>
          </div>
          <h2 className="font-heading text-xl text-white">{copy.addressTitle}</h2>
          <p className="text-sm text-white/70">{copy.addressText}</p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
            <p className="text-sm font-medium text-white">EvionShop</p>
            <p className="text-sm text-white/70">{copy.country}</p>
          </div>
          <a
            href="https://maps.app.goo.gl/eSMKdCjY7Ea82vuH7"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#4f46e5,#1d9bf0)] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(79,70,229,0.4)] transition hover:brightness-110"
          >
            <MapPin size={16} />
            {copy.maps}
          </a>
        </section>

        {/* Benefits */}
        <section className="card-glow space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-blue-300" />
            <p className="text-xs uppercase tracking-[0.18em] text-blue-300">{copy.whyUs}</p>
          </div>
          <h2 className="font-heading text-xl text-white">{copy.benefitsTitle}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">{copy.benefits[0][0]}</p>
                <p className="text-xs text-white/55 mt-0.5">{copy.benefits[0][1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck size={16} className="mt-0.5 flex-shrink-0 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">{copy.benefits[1][0]}</p>
                <p className="text-xs text-white/55 mt-0.5">{copy.benefits[1][1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">{copy.benefits[2][0]}</p>
                <p className="text-xs text-white/55 mt-0.5">{copy.benefits[2][1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 size={16} className="mt-0.5 flex-shrink-0 text-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">{copy.benefits[3][0]}</p>
                <p className="text-xs text-white/55 mt-0.5">{copy.benefits[3][1]}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

