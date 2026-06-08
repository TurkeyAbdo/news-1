import type { Category, CategorySlug } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "politics", name: "سياسة" },
  { slug: "economy", name: "اقتصاد" },
  { slug: "world", name: "العالم" },
  { slug: "local", name: "محليات" },
  { slug: "culture", name: "ثقافة" },
  { slug: "sports", name: "رياضة" },
  { slug: "science", name: "علوم وتكنولوجيا" },
];

export const CATEGORY_MAP: Record<CategorySlug, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.slug] = c;
    return acc;
  },
  {} as Record<CategorySlug, Category>
);

export function categoryName(slug: CategorySlug): string {
  return CATEGORY_MAP[slug]?.name ?? slug;
}
