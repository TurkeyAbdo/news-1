import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const isVideo = file.type.startsWith("video/");
  try {
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "seif-news", resource_type: isVideo ? "video" : "image" },
            (err, res) => {
              if (err || !res) return reject(err);
              resolve(res as { secure_url: string });
            }
          )
          .end(buf);
      }
    );
    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}
