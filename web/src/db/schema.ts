import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

// Topic categories (politics, economy, world, local, culture, sports, science)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: text("name").notNull(), // Arabic display name
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""), // sanitized HTML
  image: text("image").notNull().default(""),
  category: varchar("category", { length: 64 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  image: text("image").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const investigations = pgTable("investigations", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  image: text("image").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  thumbnail: text("thumbnail").notNull().default(""),
  duration: varchar("duration", { length: 16 }).notNull().default(""),
  videoUrl: text("video_url"), // external (e.g. YouTube)
  videoFile: text("video_file"), // uploaded file URL (Cloudinary)
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const happeningNow = pgTable("happening_now", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  link: text("link"), // optional redirect to live broadcast
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
