import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/types";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/videos/${video.slug}`} className="group block">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
          sizes="(max-width:768px) 100vw, 25vw"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full bg-brand/90 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition">
            ▶
          </span>
        </span>
        <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <h3 className="text-sm font-bold leading-6 clamp-2 group-hover:text-brand transition mt-2">
        {video.title}
      </h3>
    </Link>
  );
}
