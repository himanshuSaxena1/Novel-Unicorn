import api from "@/lib/axios";
import { ChapterClient } from "@/components/chapter-client";
import { ChapterNotFound } from "@/components/ChapterNotFound";
import { getChapter, NovelAPI } from "@/lib/api";

export default async function ChapterPage({
    params,
}: {
    params: { slug: string; chapterSlug: string };
}) {
    const res = await getChapter(params.slug, params.chapterSlug)
    const trendingNovels = await NovelAPI.getTrendingNovels(10)


    if (!res || res.status !== 200) return <ChapterNotFound />;

    const data = await res.json();

    return <ChapterClient data={data} trendingNovels={trendingNovels} />;
}
