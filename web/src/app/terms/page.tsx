import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "شروط الاستخدام" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Breadcrumbs items={[{ label: "شروط الاستخدام" }]} />
      <h1 className="section-title text-2xl mb-6">شروط الاستخدام</h1>
      <div className="article-body">
        <p>
          مرحباً بك في موقع وكالة الأنباء. باستخدامك لهذا الموقع فإنك توافق على
          الالتزام بشروط الاستخدام التالية، لذا نرجو قراءتها بعناية.
        </p>
        <p>
          جميع المواد المنشورة على الموقع من نصوص وصور وفيديوهات هي ملك للوكالة
          ولا يجوز إعادة نشرها أو اقتباسها دون الإشارة إلى المصدر.
        </p>
        <p>
          تبذل الوكالة قصارى جهدها لضمان دقة المعلومات المنشورة، إلا أنها لا تتحمل
          المسؤولية عن أي أخطاء غير مقصودة أو انقطاع في الخدمة.
        </p>
        <p>
          تحتفظ الوكالة بحقها في تعديل هذه الشروط في أي وقت، ويعدّ استمرارك في
          استخدام الموقع موافقة على الشروط المحدّثة.
        </p>
      </div>
    </div>
  );
}
