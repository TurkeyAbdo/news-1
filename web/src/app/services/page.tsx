import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "خدماتنا" };

const SERVICES = [
  {
    icon: "📰",
    title: "خدمة الأخبار",
    desc: "تغطية إخبارية شاملة ومتواصلة على مدار الساعة لأبرز الأحداث المحلية والدولية.",
  },
  {
    icon: "📊",
    title: "تقارير وتحليلات",
    desc: "تقارير معمّقة وتحليلات متخصصة تقدم قراءة دقيقة لأهم القضايا والملفات.",
  },
  {
    icon: "🎥",
    title: "إنتاج مرئي",
    desc: "إنتاج محتوى مرئي احترافي من تقارير مصوّرة ومقابلات وتغطيات ميدانية.",
  },
  {
    icon: "🤝",
    title: "خدمات الاشتراك",
    desc: "باقات اشتراك مخصصة للمؤسسات الإعلامية للحصول على محتوى الوكالة.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "خدماتنا" }]} />
      <h1 className="section-title text-2xl mb-3">خدماتنا</h1>
      <p className="text-muted leading-8 mb-8 max-w-3xl">
        نقدّم مجموعة متكاملة من الخدمات الإعلامية التي تلبّي احتياجات المؤسسات
        والأفراد، مع التزامنا بأعلى معايير الدقة والمهنية والمصداقية.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="border border-line rounded-xl p-6 hover:shadow-md hover:border-brand transition"
          >
            <span className="text-4xl">{s.icon}</span>
            <h2 className="text-lg font-bold text-ink mt-3">{s.title}</h2>
            <p className="text-sm text-muted leading-7 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
