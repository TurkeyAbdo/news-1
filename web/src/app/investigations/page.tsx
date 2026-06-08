import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getInvestigations } from "@/lib/strapi";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;
export const metadata: Metadata = { title: "حوارات وتحقيقات" };

export default async function InvestigationsPage() {
  const items = await getInvestigations(24);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "حوارات وتحقيقات" }]} />
      <h1 className="section-title text-2xl mb-6">حوارات وتحقيقات</h1>
      {items.length === 0 ? (
        <p className="text-muted">لا توجد حوارات أو تحقيقات حالياً.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/investigations/${it.slug}`}
              className="group flex gap-4 items-start"
            >
              <div className="relative w-44 h-32 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  sizes="176px"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-brand">تحقيق</span>
                <h2 className="text-base font-bold leading-7 clamp-2 group-hover:text-brand transition mt-1">
                  {it.title}
                </h2>
                <p className="text-sm text-muted clamp-2 mt-1">{it.excerpt}</p>
                <span className="text-xs text-muted mt-1 block">
                  {formatArabicDate(it.publishedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
