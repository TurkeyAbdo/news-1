"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
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
import { isAuthed, SESSION_COOKIE } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABLES: Record<string, any> = {
  articles,
  reports,
  investigations,
  videos,
  categories,
  happening_now: happeningNow,
};

function coerce(type: string, raw: FormDataEntryValue | null): unknown {
  if (type === "boolean") return raw === "on" || raw === "true";
  const s = raw == null ? "" : String(raw);
  if ((type === "url" || type === "video") && s.trim() === "") return null;
  return s;
}

export async function saveEntity(collectionKey: string, formData: FormData) {
  if (!(await isAuthed())) redirect("/admin/login");
  const col = getCollection(collectionKey);
  if (!col) throw new Error("unknown collection");
  const table = TABLES[col.table];

  const values: Record<string, unknown> = {};
  for (const f of col.fields) {
    values[f.name] = coerce(f.type, formData.get(f.name));
  }

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : 0;

  if (id > 0) {
    await db.update(table).set(values).where(eq(table.id, id));
  } else {
    await db.insert(table).values(values);
  }

  revalidatePath("/");
  revalidatePath(`/admin/${collectionKey}`);
  redirect(`/admin/${collectionKey}`);
}

export async function deleteEntity(collectionKey: string, id: number) {
  if (!(await isAuthed())) redirect("/admin/login");
  const col = getCollection(collectionKey);
  if (!col) throw new Error("unknown collection");
  const table = TABLES[col.table];
  await db.delete(table).where(eq(table.id, id));
  revalidatePath("/");
  revalidatePath(`/admin/${collectionKey}`);
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
