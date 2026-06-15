// Declarative config powering the generic admin CRUD.
export type FieldType =
  | "text"
  | "textarea"
  | "html"
  | "image"
  | "video"
  | "category"
  | "boolean"
  | "url";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
}

export interface CollectionDef {
  key: string; // URL segment
  table: string; // db table key
  labelAr: string;
  fields: FieldDef[];
}

const common = [
  { name: "title", label: "العنوان", type: "text", required: true },
  { name: "slug", label: "الرابط (slug)", type: "text", required: true },
  { name: "excerpt", label: "الملخص", type: "textarea" },
  { name: "body", label: "المحتوى", type: "html" },
  { name: "image", label: "صورة الغلاف", type: "image" },
] as FieldDef[];

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "articles",
    table: "articles",
    labelAr: "الأخبار",
    fields: [
      ...common.slice(0, 4),
      { name: "image", label: "صورة الغلاف", type: "image" },
      { name: "category", label: "القسم", type: "category", required: true },
      { name: "featured", label: "خبر رئيسي (Featured)", type: "boolean" },
    ],
  },
  { key: "reports", table: "reports", labelAr: "التقارير", fields: common },
  {
    key: "investigations",
    table: "investigations",
    labelAr: "التحقيقات",
    fields: common,
  },
  {
    key: "videos",
    table: "videos",
    labelAr: "الفيديو",
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true },
      { name: "slug", label: "الرابط (slug)", type: "text", required: true },
      { name: "description", label: "الوصف", type: "textarea" },
      { name: "thumbnail", label: "الصورة المصغرة", type: "image" },
      { name: "duration", label: "المدة (مثال 03:42)", type: "text" },
      { name: "videoUrl", label: "رابط الفيديو (يوتيوب)", type: "url" },
      { name: "videoFile", label: "رفع ملف فيديو", type: "video" },
    ],
  },
  {
    key: "categories",
    table: "categories",
    labelAr: "الأقسام",
    fields: [
      { name: "slug", label: "المعرّف (slug)", type: "text", required: true },
      { name: "name", label: "الاسم بالعربية", type: "text", required: true },
    ],
  },
  {
    key: "happening-now",
    table: "happening_now",
    labelAr: "عاجل / يحدث الآن",
    fields: [
      { name: "text", label: "النص", type: "text", required: true },
      { name: "link", label: "رابط البث (اختياري)", type: "url" },
    ],
  },
];

export function getCollection(key: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}

export const CATEGORY_OPTIONS: { slug: string; name: string }[] = [
  { slug: "politics", name: "سياسة" },
  { slug: "economy", name: "اقتصاد" },
  { slug: "world", name: "العالم" },
  { slug: "local", name: "محليات" },
  { slug: "culture", name: "ثقافة" },
  { slug: "sports", name: "رياضة" },
  { slug: "science", name: "علوم وتكنولوجيا" },
];
