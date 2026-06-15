import Link from "next/link";
import { notFound } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import {
  articles,
  reports,
  investigations,
  videos,
  categories,
  happeningNow,
} from "@/db/schema";
import { getCollection } from "@/lib/admin-config";
import { deleteEntity } from "../actions";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABLES: Record<string, any> = {
  articles,
  reports,
  investigations,
  videos,
  categories,
  happening_now: happeningNow,
};

export default async function ListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const col = getCollection(type);
  if (!col) notFound();
  const table = TABLES[col.table];
  const orderCol = table.publishedAt ?? table.createdAt ?? table.id;
  const rows = (await db
    .select()
    .from(table)
    .orderBy(desc(orderCol))
    .limit(200)) as Record<string, unknown>[];

  const titleField = col.fields.find((f) =>
    ["title", "text", "name"].includes(f.name)
  )?.name ?? "id";

  return (
    <main className="max-w-3xl mx-auto p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-muted hover:underline">
            ← لوحة التحكم
          </Link>
          <h1 className="text-xl font-bold text-ink">{col.labelAr}</h1>
        </div>
        <Link
          href={`/admin/${type}/new`}
          className="bg-brand text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-brand-dark"
        >
          + إضافة
        </Link>
      </div>

      <ul className="space-y-2">
        {rows.length === 0 && (
          <li className="text-muted text-sm">لا يوجد محتوى بعد.</li>
        )}
        {rows.map((r) => {
          const id = Number(r.id);
          return (
            <li
              key={id}
              className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
            >
              <span className="text-ink truncate">{String(r[titleField])}</span>
              <span className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/${type}/${id}`}
                  className="text-sm text-brand hover:underline"
                >
                  تعديل
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteEntity(type, id);
                  }}
                >
                  <button className="text-sm text-red-600 hover:underline">
                    حذف
                  </button>
                </form>
              </span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
