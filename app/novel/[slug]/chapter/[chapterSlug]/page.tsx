import api from "@/lib/axios";
import { ChapterClient } from "@/components/chapter-client";
import { ChapterNotFound } from "@/components/ChapterNotFound";
import { getChapter } from "@/lib/api";

export default async function ChapterPage({
    params,
}: {
    params: { slug: string; chapterSlug: string };
}) {
    const res = await getChapter(params.slug, params.chapterSlug)


    if (!res || res.status !== 200) return <ChapterNotFound />;

    const data = await res.json();

    return <ChapterClient data={data} />;
}
