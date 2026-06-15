import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import {
  categories,
  articles,
  reports,
  investigations,
  videos,
  happeningNow,
} from "./schema";

const CATEGORIES: { slug: string; name: string }[] = [
  { slug: "politics", name: "سياسة" },
  { slug: "economy", name: "اقتصاد" },
  { slug: "world", name: "العالم" },
  { slug: "local", name: "محليات" },
  { slug: "culture", name: "ثقافة" },
  { slug: "sports", name: "رياضة" },
  { slug: "science", name: "علوم وتكنولوجيا" },
];

const IMG = (seed: string) => `https://picsum.photos/seed/${seed}/1200/800`;
const P = (t: string) => `<p>${t}</p>`;

async function main() {
  console.log("Seeding categories...");
  await db.insert(categories).values(CATEGORIES).onConflictDoNothing();

  console.log("Seeding articles...");
  await db
    .insert(articles)
    .values([
      {
        slug: "summit-regional-cooperation",
        title: "قمة إقليمية تبحث سبل تعزيز التعاون الاقتصادي",
        excerpt: "اجتمع قادة المنطقة لمناقشة ملفات التنمية والتجارة المشتركة.",
        body: P("انطلقت أعمال القمة الإقليمية بمشاركة واسعة من القادة والوزراء لبحث آفاق التعاون الاقتصادي والتنموي بين دول المنطقة.") + P("وأكد المشاركون على أهمية تكامل الجهود لمواجهة التحديات الراهنة."),
        image: IMG("summit"),
        category: "politics",
        featured: true,
        views: 1240,
      },
      {
        slug: "markets-rise-energy",
        title: "أسواق الطاقة تسجل ارتفاعًا ملحوظًا",
        excerpt: "تحسن أداء الأسواق مدفوعًا بزيادة الطلب العالمي.",
        body: P("شهدت أسواق الطاقة ارتفاعًا في الأسعار نتيجة ازدياد الطلب وتحسن المؤشرات الاقتصادية العالمية."),
        image: IMG("energy"),
        category: "economy",
        views: 860,
      },
      {
        slug: "international-relief-effort",
        title: "جهود إغاثية دولية لمساعدة المتضررين",
        excerpt: "منظمات دولية تطلق حملة لتقديم المساعدات الإنسانية.",
        body: P("أعلنت منظمات إنسانية دولية عن إطلاق حملة إغاثية واسعة لتقديم الدعم للمتضررين في المناطق المنكوبة."),
        image: IMG("relief"),
        category: "world",
        views: 540,
      },
      {
        slug: "local-infrastructure-project",
        title: "إطلاق مشروع بنية تحتية جديد في العاصمة",
        excerpt: "المشروع يهدف لتحسين شبكة الطرق والخدمات.",
        body: P("بدأت الجهات المختصة تنفيذ مشروع بنية تحتية ضخم يستهدف تطوير شبكة الطرق والخدمات العامة في العاصمة."),
        image: IMG("infra"),
        category: "local",
        featured: true,
        views: 970,
      },
      {
        slug: "cultural-festival-opens",
        title: "افتتاح المهرجان الثقافي السنوي",
        excerpt: "فعاليات متنوعة تحتفي بالتراث والفنون.",
        body: P("افتُتح المهرجان الثقافي السنوي بحضور نخبة من المثقفين والفنانين، ويتضمن فعاليات متنوعة تحتفي بالتراث."),
        image: IMG("festival"),
        category: "culture",
        views: 410,
      },
      {
        slug: "national-team-victory",
        title: "المنتخب الوطني يحقق فوزًا مهمًا",
        excerpt: "انتصار يعزز فرص التأهل في البطولة.",
        body: P("حقق المنتخب الوطني فوزًا مهمًا في مباراته الأخيرة، ما يعزز فرصه في التأهل إلى الأدوار النهائية."),
        image: IMG("football"),
        category: "sports",
        views: 1530,
      },
      {
        slug: "tech-innovation-award",
        title: "جائزة للابتكار التكنولوجي تكرّم الشباب",
        excerpt: "مبادرة لدعم رواد الأعمال في مجال التقنية.",
        body: P("كرّمت جائزة الابتكار التكنولوجي عددًا من الشباب المبدعين تقديرًا لمشاريعهم الريادية في مجال التقنية."),
        image: IMG("tech"),
        category: "science",
        views: 320,
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding reports...");
  await db
    .insert(reports)
    .values([
      {
        slug: "report-economic-outlook",
        title: "تقرير: آفاق الاقتصاد في العام المقبل",
        excerpt: "قراءة تحليلية في أبرز المؤشرات والتوقعات.",
        body: P("يستعرض هذا التقرير أبرز المؤشرات الاقتصادية والتوقعات للعام المقبل في ضوء المتغيرات العالمية."),
        image: IMG("report1"),
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding investigations...");
  await db
    .insert(investigations)
    .values([
      {
        slug: "investigation-water-resources",
        title: "تحقيق: إدارة الموارد المائية والتحديات",
        excerpt: "ملف معمّق حول واقع الموارد المائية.",
        body: P("يكشف هذا التحقيق عن أبرز التحديات التي تواجه إدارة الموارد المائية والحلول الممكنة لمواجهتها."),
        image: IMG("invest1"),
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding videos...");
  await db
    .insert(videos)
    .values([
      {
        slug: "video-summit-highlights",
        title: "أبرز لحظات القمة الإقليمية",
        description: "ملخص مصور لأهم ما جاء في القمة.",
        thumbnail: IMG("vid1"),
        duration: "03:42",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding happening-now...");
  await db
    .insert(happeningNow)
    .values([
      { text: "عاجل: انطلاق أعمال القمة الإقليمية في العاصمة" },
      { text: "تطورات متسارعة في أسواق الطاقة العالمية" },
      { text: "بث مباشر لفعاليات المهرجان الثقافي", link: "https://www.youtube.com" },
    ]);

  console.log("✓ Seed complete");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
