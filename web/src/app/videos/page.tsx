import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import VideoCard from "@/components/VideoCard";
import { getVideos } from "@/lib/strapi";

export const revalidate = 60;
export const metadata: Metadata = { title: "فيديو" };

export default async function VideosPage() {
  const videos = await getVideos(24);
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "فيديو" }]} />
      <h1 className="section-title text-2xl mb-6">فيديو</h1>
      {videos.length === 0 ? (
        <p className="text-muted">لا توجد مقاطع فيديو حالياً.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
