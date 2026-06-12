import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHappeningNow } from "@/lib/strapi";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "سيف نيوز | آخر الأخبار",
    template: "%s | سيف نيوز",
  },
  description:
    "سيف نيوز - موقع إخباري شامل يقدم آخر الأخبار والتقارير والتحقيقات والفيديوهات في السياسة والاقتصاد والعالم والرياضة والثقافة.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ticker = await getHappeningNow(8);
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header ticker={ticker} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
