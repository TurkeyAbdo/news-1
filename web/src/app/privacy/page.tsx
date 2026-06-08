import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Breadcrumbs items={[{ label: "سياسة الخصوصية" }]} />
      <h1 className="section-title text-2xl mb-6">سياسة الخصوصية</h1>
      <div className="article-body">
        <p>
          نحرص في وكالة الأنباء على حماية خصوصية زوّارنا والحفاظ على سرية
          بياناتهم. توضّح هذه السياسة كيفية جمعنا للمعلومات واستخدامها وحمايتها.
        </p>
        <p>
          نقوم بجمع بعض البيانات غير الشخصية مثل نوع المتصفح وصفحات الزيارة بهدف
          تحسين تجربة الاستخدام وتطوير المحتوى المقدّم.
        </p>
        <p>
          لا نشارك بياناتك مع أي طرف ثالث دون موافقتك، باستثناء ما تقتضيه
          الأنظمة والقوانين المعمول بها.
        </p>
        <p>
          باستخدامك للموقع فإنك توافق على بنود سياسة الخصوصية هذه. وقد نقوم
          بتحديثها من وقت لآخر وننشر أي تعديلات على هذه الصفحة.
        </p>
      </div>
    </div>
  );
}
