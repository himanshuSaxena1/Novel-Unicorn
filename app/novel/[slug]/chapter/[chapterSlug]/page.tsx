import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RichTextRenderer } from "@/components/MarkdownReader"
import api from "@/lib/axios"
import { ReaderProvider } from "@/components/reader/reader-provider"
import { ReadingControls } from "@/components/reader/reading-controls"
import { ReaderContainer } from "@/components/reader/reader-container"

export default async function ChapterPage({
    params,
}: {
    params: { slug: string; chapterSlug: string }
}) {
    const res = await api.get(`/novels/${params.slug}/chapters/${params.chapterSlug}`);

    if (!res.status || res.status !== 200) {
        if (res.status === 404) return notFound();
        throw new Error("Failed to load chapter");
    }
    
    const { novel, chapter, prev, next } = res.data;
    


    return (
        <ReaderProvider>
            <main className="max-w-5xl mx-auto px-3 md:px-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 md:py-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Link
                            href={`/novels/${novel.slug}`}
                            className="text-muted-foreground hover:underline"
                        >
                            {novel.title}
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{chapter.title}</span>
                    </div>
                    <div className="hidden gap-2 md:flex">
                        {prev ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/novel/${novel.slug}/chapter/${prev.slug}`}>Previous</Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                        )}
                        {next ? (
                            <Button asChild size="sm">
                                <Link href={`/novel/${novel.slug}/chapter/${next.slug}`}>Next</Link>
                            </Button>
                        ) : (
                            <Button size="sm" disabled>
                                Next
                            </Button>
                        )}
                    </div>
                </div>
                <ReadingControls />
                <ReaderContainer>
                    <RichTextRenderer content={chapter.content} />
                </ReaderContainer>

                <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-6 blcok md:hidden">
                    {prev ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/novel/${novel.slug}/chapter/${prev.slug}`}>Previous</Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                    )}
                    {next ? (
                        <Button asChild size="sm">
                            <Link href={`/novel/${novel.slug}/chapter/${next.slug}`}>Next</Link>
                        </Button>
                    ) : (
                        <Button size="sm" disabled>
                            Next
                        </Button>
                    )}
                </div>
            </main>
        </ReaderProvider>
    )
}
