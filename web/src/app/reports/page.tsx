import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getReports } from "@/lib/strapi";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "تقارير وتحليلات" };

export default async function ReportsPage() {
  const reports = await getReports(24);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "تقارير" }]} />
      <h1 className="section-title text-2xl mb-6">تقارير وتحليلات</h1>
      {reports.length === 0 ? (
        <p className="text-muted">لا توجد تقارير حالياً.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <Link key={r.id} href={`/reports/${r.slug}`} className="group block">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <span className="absolute top-2 right-2 bg-ink text-white text-xs font-bold px-2 py-1 rounded">
                  تقرير
                </span>
              </div>
              <h2 className="text-lg font-bold leading-7 clamp-2 group-hover:text-brand transition mt-3">
                {r.title}
              </h2>
              <p className="text-sm text-muted clamp-2 mt-1">{r.excerpt}</p>
              <span className="text-xs text-muted mt-2 block">
                {formatArabicDate(r.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
