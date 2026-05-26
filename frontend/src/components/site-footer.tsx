"use client";

import Link from "next/link";
import { Camera, MessageCircle, Music2, Send } from "lucide-react";
import { socialLinks } from "@/lib/contact";
import { Translation } from "@/lib/types";
import { usePathname } from "next/navigation";

type Props = {
  tr: Translation;
};

export function SiteFooter({ tr }: Props) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "uk";

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#040714]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-white/60 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <p>© {new Date().getFullYear()} EvionShop. {tr.footer.rights}</p>
          <Link 
            href={`/${locale}/admin`} 
            title="Admin Panel" 
            className="text-white/30 hover:text-white/60 transition text-xs opacity-50 hover:opacity-100"
          >
            •
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <a className="icon-btn" href={socialLinks.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
            <Send size={14} />
          </a>
          <a className="icon-btn" href={socialLinks.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <MessageCircle size={14} />
          </a>
          <a className="icon-btn" href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <Camera size={14} />
          </a>
          <a className="icon-btn" href={socialLinks.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
            <Music2 size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
