import Link from "next/link";
import { COLLECTIONS } from "@/lib/admin-config";
import { logout } from "./actions";

export const metadata = { title: "لوحة التحكم — سيف نيوز" };
export const dynamic = "force-dynamic";

export default function AdminHome() {
  return (
    <main className="max-w-3xl mx-auto p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">لوحة التحكم</h1>
        <form action={logout}>
          <button className="text-sm text-red-600 hover:underline">
            تسجيل الخروج
          </button>
        </form>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.key}
            href={`/admin/${c.key}`}
            className="block bg-white border rounded-xl p-5 text-center font-semibold text-ink hover:border-brand hover:text-brand transition"
          >
            {c.labelAr}
          </Link>
        ))}
      </div>
    </main>
  );
}
