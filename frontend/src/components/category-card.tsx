"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { translateCategoryName } from "@/lib/category-translations";
import {
  Laptop,
  Smartphone,
  Gamepad2,
  Headphones,
  Camera,
  Watch,
  TabletSmartphone,
  Monitor,
  Cpu,
  Sparkles,
} from "lucide-react";

const categoryIconMap: Record<string, typeof Laptop> = {
  Laptops: Laptop,
  "Компьютеры": Laptop,
  Laptopy: Laptop,
  Phones: Smartphone,
  "Телефоны": Smartphone,
  Telefony: Smartphone,
  Gaming: Gamepad2,
  Ігри: Gamepad2,
  Gry: Gamepad2,
  Audio: Headphones,
  "Аудио": Headphones,
  Dźwięk: Headphones,
  Cameras: Camera,
  "Камеры": Camera,
  Kamery: Camera,
  Watches: Watch,
  "Часы": Watch,
  Zegarki: Watch,
  Tablets: TabletSmartphone,
  "Планшеты": TabletSmartphone,
  Tablety: TabletSmartphone,
  Monitors: Monitor,
  "Мониторы": Monitor,
  Monitory: Monitor,
  Components: Cpu,
  "Компоненты": Cpu,
  Komponenty: Cpu,
  Electronics: Sparkles,
  "Электроника": Sparkles,
  Elektronika: Sparkles,
};

const categoryEmojiMap: Record<string, string> = {
  "Дом": "🏠",
  "Дім": "🏠",
  Dom: "🏠",
  Home: "🏠",
  "Годинники": "⌚",
  "Часы": "⌚",
  Zegarki: "⌚",
  Watches: "⌚",
  "Телефоны": "📱",
  "Телефони": "📱",
  Telefony: "📱",
  Phones: "📱",
  "Компьютеры": "💻",
  "Комп'ютери": "💻",
  Komputery: "💻",
  Computers: "💻",
  "Аудиотехника": "🎧",
  "Аудіотехніка": "🎧",
  Audio: "🎧",
  "Аксессуары": "🧰",
  "Аксесуари": "🧰",
  Akcesoria: "🧰",
  Accessories: "🧰",
  "Девайсы": "🔌",
  Urzadzenia: "🔌",
  Devices: "🔌",
  "Бытовая техника": "🏡",
  "Побутова техніка": "🏡",
  AGD: "🏡",
  "Home Appliances": "🏡",
};

const categoryColorMap: Record<number, string> = {
  0: "from-blue-600 to-blue-400",
  1: "from-purple-600 to-purple-400",
  2: "from-orange-600 to-orange-400",
  3: "from-pink-600 to-pink-400",
  4: "from-green-600 to-green-400",
  5: "from-indigo-600 to-indigo-400",
  6: "from-cyan-600 to-cyan-400",
  7: "from-amber-600 to-amber-400",
};

type Props = {
  name: string;
  locale: string;
  index: number;
  delay?: number;
};

export function CategoryCard({ name, locale, index, delay = 0 }: Props) {
  const translatedName = translateCategoryName(name, locale as any);
  const Icon = categoryIconMap[name] || Sparkles;
  const emoji = categoryEmojiMap[name];
  const colorGradient = categoryColorMap[index % Object.keys(categoryColorMap).length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Link href={`/${locale}/catalog?category=${encodeURIComponent(name)}`}>
        <motion.div
          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${colorGradient} p-6 cursor-pointer transition-all duration-300`}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center h-32 text-center">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {emoji ? (
                <span className="mb-3 block text-4xl leading-none drop-shadow-lg" aria-hidden="true">
                  {emoji}
                </span>
              ) : (
                <Icon size={40} className="text-white mb-3 drop-shadow-lg" />
              )}
            </motion.div>

            <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors line-clamp-2">
              {translatedName}
            </h3>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 bg-white/30 rounded-t-full group-hover:w-12 transition-all duration-300" />
          </div>

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5"
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
