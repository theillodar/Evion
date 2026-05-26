import type { Metadata } from "next";
import { Exo_2, Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";

const headingFont = Exo_2({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

const cyrillicFont = Noto_Sans({
  variable: "--font-cyrillic",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "EvionShop | Amazon Returns Catalog",
  description:
    "Modern multilingual catalog for Amazon return products with Telegram and WhatsApp ordering.",
  metadataBase: new URL("https://evionshop.example"),
  openGraph: {
    title: "EvionShop | Amazon Returns Catalog",
    description:
      "Discover tested Amazon return products and contact a manager in one click.",
    type: "website",
    siteName: "EvionShop",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} ${cyrillicFont.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
