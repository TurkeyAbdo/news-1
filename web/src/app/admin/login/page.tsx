import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { checkCredentials, createSession, SESSION_COOKIE } from "@/lib/auth";

export const metadata = { title: "تسجيل الدخول — لوحة التحكم" };

async function login(formData: FormData) {
  "use server";
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }
  const token = await createSession();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-4">
      <form
        action={login}
        className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-ink text-center">لوحة التحكم</h1>
        {error && (
          <p className="text-sm text-red-600 text-center">
            بيانات الدخول غير صحيحة
          </p>
        )}
        <input
          name="username"
          placeholder="اسم المستخدم"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="كلمة المرور"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-brand text-white rounded-lg py-2 font-semibold hover:bg-brand-dark"
        >
          دخول
        </button>
      </form>
    </main>
  );
}
