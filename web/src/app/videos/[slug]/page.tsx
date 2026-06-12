import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoCard from "@/components/VideoCard";
import { getVideoBySlug, getVideos } from "@/lib/strapi";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;

/** Convert a YouTube/Vimeo watch URL into an embeddable URL. */
function toEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url; // generic embeddable URL
  } catch {
    return undefined;
  }
}

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
  const embedUrl = toEmbedUrl(video.videoUrl);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Breadcrumbs items={[{ label: "فيديو", href: "/videos" }, { label: video.title }]} />

      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        {video.videoFile ? (
          // Uploaded video file → native HTML5 player
          <video
            controls
            playsInline
            poster={video.thumbnail}
            src={video.videoFile}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        ) : embedUrl ? (
          // External URL (YouTube/Vimeo/etc.) → embedded iframe
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          // No source yet → thumbnail with a play badge
          <>
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
          </>
        )}
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
