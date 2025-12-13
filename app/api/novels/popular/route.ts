import { NovelAPI } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") || undefined;

  const novels = await NovelAPI.getPopularNovels(genre, 9);
  return NextResponse.json(novels);
}
