import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import RichText from "@/components/RichText";
import { getInvestigationBySlug } from "@/lib/strapi";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const it = await getInvestigationBySlug(slug);
  return it ? { title: it.title, description: it.excerpt } : { title: "غير موجود" };
}

export default async function InvestigationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const it = await getInvestigationBySlug(slug);
  if (!it) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "حوارات وتحقيقات", href: "/investigations" },
          { label: it.title },
        ]}
      />
      <article>
        <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded">
          تحقيق
        </span>
        <h1 className="text-2xl md:text-4xl font-black leading-snug mt-4 text-ink">
          {it.title}
        </h1>
        <div className="text-sm text-muted mt-3 pb-4 border-b border-line">
          {formatArabicDate(it.publishedAt)} · وكالة الأنباء
        </div>
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden my-6">
          <Image
            src={it.image}
            alt={it.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width:896px) 100vw, 896px"
          />
        </div>
        {it.excerpt && (
          <p className="text-lg font-semibold text-ink leading-8 mb-6">
            {it.excerpt}
          </p>
        )}
        <RichText content={it.body} />
      </article>
    </div>
  );
}
