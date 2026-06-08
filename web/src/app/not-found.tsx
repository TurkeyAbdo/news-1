import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <span className="text-7xl font-black text-brand">404</span>
      <h1 className="text-2xl font-bold text-ink mt-4">
        الصفحة غير موجودة
      </h1>
      <p className="text-muted mt-2">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 bg-brand text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-dark transition"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
