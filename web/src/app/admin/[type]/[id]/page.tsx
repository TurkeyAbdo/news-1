import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
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
import EntityForm from "@/components/admin/EntityForm";
import { saveEntity } from "../../actions";

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

export default async function EditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const col = getCollection(type);
  if (!col) notFound();

  let row: Record<string, unknown> | null = null;
  if (id !== "new") {
    const table = TABLES[col.table];
    const found = await db
      .select()
      .from(table)
      .where(eq(table.id, Number(id)))
      .limit(1);
    row = (found[0] as Record<string, unknown>) ?? null;
    if (!row) notFound();
  }

  async function action(formData: FormData) {
    "use server";
    await saveEntity(type, formData);
  }

  return (
    <main className="max-w-2xl mx-auto p-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/admin/${type}`}
          className="text-sm text-muted hover:underline"
        >
          ← {col.labelAr}
        </Link>
        <h1 className="text-xl font-bold text-ink">
          {id === "new" ? "إضافة جديد" : "تعديل"}
        </h1>
      </div>
      <EntityForm collection={col} row={row} action={action} />
    </main>
  );
}
