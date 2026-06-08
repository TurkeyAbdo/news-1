import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoCard from "@/components/VideoCard";
import { getVideoBySlug, getVideos } from "@/lib/strapi";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVideoBySlug(slug);
  return v ? { title: v.title, description: v.description } : { title: "غير موجود" };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  const more = (await getVideos(8)).filter((v) => v.id !== video.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "فيديو", href: "/videos" }, { label: video.title }]} />

      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          priority
          className="object-cover opacity-80"
          sizes="(max-width:1024px) 100vw, 1024px"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-20 h-20 rounded-full bg-brand text-white flex items-center justify-center text-3xl shadow-xl">
            ▶
          </span>
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-black leading-snug mt-5 text-ink">
        {video.title}
      </h1>
      <div className="text-sm text-muted mt-2">
        {formatArabicDate(video.publishedAt)}
        {video.duration ? ` · ${video.duration}` : ""}
      </div>
      <p className="text-base text-ink leading-8 mt-4">{video.description}</p>

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title text-xl">مقاطع أخرى</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {more.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
