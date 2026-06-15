// Article/report/investigation bodies are sanitized HTML strings.
export type RichBody = string;

export type CategorySlug =
  | "politics"
  | "economy"
  | "world"
  | "local"
  | "culture"
  | "sports"
  | "science";

export interface Category {
  slug: CategorySlug;
  name: string; // Arabic display name
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: RichBody; // Strapi blocks rich text
  image: string;
  category: CategorySlug;
  publishedAt: string; // ISO date
  featured?: boolean;
}

export interface Report {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: RichBody;
  image: string;
  publishedAt: string;
}

export interface Investigation {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: RichBody;
  image: string;
  publishedAt: string;
}

export interface Video {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  videoUrl?: string; // external URL (e.g. YouTube)
  videoFile?: string; // uploaded video file URL
}

export interface HappeningNowItem {
  id: number;
  text: string;
  time: string; // HH:MM
  link?: string; // optional redirect to the live broadcast
}
