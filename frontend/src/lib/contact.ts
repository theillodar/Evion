import { Product } from "@/lib/types";

const TELEGRAM_USERNAME = "evionshop";
const WHATSAPP_NUMBER = "48796504372";

export function buildContactMessage(product: Product): string {
  return `Hello! I want to order: ${product.name} (${product.code})`;
}

export function getTelegramLink(message: string): string {
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const socialLinks = {
  telegram: `https://t.me/${TELEGRAM_USERNAME}`,
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  instagram: "https://instagram.com/evionshop.work",
  tiktok: "https://tiktok.com/@evionshop",
};
