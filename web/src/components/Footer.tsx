import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";

const SECTIONS = [
  { href: "/reports", label: "تقارير" },
  { href: "/investigations", label: "حوارات وتحقيقات" },
  { href: "/videos", label: "فيديو" },
  { href: "/happening-now", label: "الآن مباشر" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-gray-300 mt-12">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <Image
            src="/brand/seif-news-logo-white.png"
            alt="سيف نيوز SEIF NEWS"
            width={180}
            height={56}
            className="h-11 w-auto"
          />
          <p className="mt-4 text-sm leading-7 text-gray-400">
            موقع إخباري شامل يقدم تغطية دقيقة ومتوازنة لآخر الأخبار والتقارير
            والتحقيقات على المستويين المحلي والدولي.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">الأقسام</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">المحتوى</h3>
          <ul className="space-y-2 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="hover:text-white">
                خدماتنا
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">روابط</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white">سياسة الخصوصية</Link></li>
            <li><Link href="/terms" className="hover:text-white">شروط الاستخدام</Link></li>
          </ul>
          <div className="flex gap-3 mt-4 text-sm">
            <a
              href="https://www.facebook.com/profile.php?id=61567372347140"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              فيسبوك
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {year} سيف نيوز SEIF NEWS. جميع الحقوق محفوظة.</span>
          <span>صُمم على غرار المواقع الإخبارية الكبرى</span>
        </div>
      </div>
    </footer>
  );
}
