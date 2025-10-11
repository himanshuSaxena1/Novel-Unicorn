import api from "@/lib/axios";
import { ChapterClient } from "@/components/chapter-client";
import { ChapterNotFound } from "@/components/ChapterNotFound";

export default async function ChapterPage({
    params,
}: {
    params: { slug: string; chapterSlug: string };
}) {
    const res = await api
        .get(`/novels/${params.slug}/chapters/${params.chapterSlug}`)
        .catch(() => null);

        
    if (!res || res.status !== 200) return <ChapterNotFound />;

    const data = res.data;
    return <ChapterClient data={data} />;
}
