import { NextResponse } from "next/server";
import { incrementArticleViews } from "@/lib/strapi";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await incrementArticleViews(slug);
  } catch {
    // non-critical
  }
  return NextResponse.json({ ok: true });
}
