"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import type { HappeningNowItem } from "@/lib/types";

const SECTIONS = [
  { href: "/reports", label: "تقارير" },
  { href: "/investigations", label: "حوارات وتحقيقات" },
  { href: "/videos", label: "فيديو" },
  { href: "/happening-now", label: "الآن مباشر" },
];

export default function Header({ ticker = [] }: { ticker?: HappeningNowItem[] }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top utility bar */}
      <div className="bg-ink text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between">
          <span className="text-gray-300">{today}</span>
          <div className="flex items-center gap-4">
            <Link href="/services" className="hover:text-white text-gray-300">
              خدماتنا
            </Link>
            <span className="hidden sm:flex items-center gap-3 text-gray-300">
              <span className="hover:text-white cursor-pointer">فيسبوك</span>
              <span className="hover:text-white cursor-pointer">إكس</span>
              <span className="hover:text-white cursor-pointer">يوتيوب</span>
            </span>
          </div>
        </div>
      </div>

      {/* Logo + search bar */}
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-brand text-white font-black text-2xl px-3 py-1 rounded">
              الوكالة
            </span>
            <span className="hidden sm:block text-ink font-bold text-lg leading-tight">
              وكالة الأنباء
              <span className="block text-xs font-normal text-muted">
                أخبار · تقارير · تحقيقات
              </span>
            </span>
          </Link>

          <form
            action="/search"
            className="hidden md:flex items-center bg-surface rounded-full px-4 h-10 w-72 border border-line focus-within:border-brand transition"
          >
            <input
              type="text"
              name="q"
              placeholder="ابحث في الموقع…"
              className="bg-transparent flex-1 outline-none text-sm"
            />
            <button type="submit" aria-label="بحث" className="text-muted">
              🔍
            </button>
          </form>

          <button
            className="md:hidden text-2xl text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-brand text-white">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="hidden md:flex items-center gap-1 h-12 text-sm font-semibold">
            <li>
              <Link
                href="/"
                className="px-3 py-2 hover:bg-brand-dark rounded transition block"
              >
                الرئيسية
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="px-3 py-2 hover:bg-brand-dark rounded transition block"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="mx-1 h-5 w-px bg-white/30" aria-hidden />
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="px-3 py-2 hover:bg-brand-dark rounded transition block whitespace-nowrap"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-brand-dark px-4 pb-4">
            <form action="/search" className="flex items-center bg-white rounded-full px-4 h-10 my-3">
              <input
                type="text"
                name="q"
                placeholder="ابحث…"
                className="bg-transparent flex-1 outline-none text-sm text-ink"
              />
              <button type="submit" aria-label="بحث" className="text-muted">🔍</button>
            </form>
            <ul className="grid grid-cols-2 gap-1 text-sm font-semibold">
              <li><Link href="/" onClick={() => setOpen(false)} className="block py-2">الرئيسية</Link></li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} onClick={() => setOpen(false)} className="block py-2">
                    {c.name}
                  </Link>
                </li>
              ))}
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} onClick={() => setOpen(false)} className="block py-2">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Breaking-news ticker */}
      <div className="bg-surface border-b border-line">
        <div className="mx-auto max-w-7xl px-4 h-10 flex items-center gap-3 overflow-hidden">
          <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded shrink-0">
            عاجل
          </span>
          <div className="overflow-hidden flex-1">
            <div className="animate-ticker text-sm text-ink">
              {ticker.map((h) => (
                <span key={h.id} className="mx-6 inline-block">
                  • {h.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
