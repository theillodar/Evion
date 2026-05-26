import { MessageCircle, Send } from "lucide-react";
import { Product, Translation } from "@/lib/types";
import { buildContactMessage, getTelegramLink, getWhatsAppLink } from "@/lib/contact";

type Props = {
  product: Product;
  tr: Translation;
};

export function ContactButtons({ product, tr }: Props) {
  const message = buildContactMessage(product);

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={getTelegramLink(message)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,#4f46e5,#1d9bf0)] px-5 py-3 text-sm font-medium text-white shadow-[0_0_18px_rgba(79,70,229,0.45)] transition hover:brightness-110"
      >
        <Send size={16} />
        {tr.product.order} Telegram
      </a>
      <a
        href={getWhatsAppLink(message)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/45 bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/25"
      >
        <MessageCircle size={16} />
        {tr.product.contact} WhatsApp
      </a>
    </div>
  );
}
