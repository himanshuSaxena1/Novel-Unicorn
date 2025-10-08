import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MarkdownReader } from "@/components/MarkdownReader"
import { log } from "console"

export default async function ChapterPage({
    params,
}: {
    params: { slug: string; chapterSlug: string }
}) {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const res = await fetch(
        `${baseUrl}/api/novels/${params.slug}/chapters/${params.chapterSlug}`,
        { cache: "no-store" }
    )


    if (!res.ok) {
        if (res.status === 404) return notFound()
        throw new Error("Failed to load chapter")
    }

    const { novel, chapter, prev, next } = await res.json()


    return (
        <main>
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
                            <Link href={`/novels/${novel.slug}/${prev.slug}`}>Previous</Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                    )}
                    {next ? (
                        <Button asChild size="sm">
                            <Link href={`/novels/${novel.slug}/${next.slug}`}>Next</Link>
                        </Button>
                    ) : (
                        <Button size="sm" disabled>
                            Next
                        </Button>
                    )}
                </div>
            </div>

            <MarkdownReader title={chapter.title} content={chapter.content} />

            <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-6 md:hidden">
                {prev ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/novels/${novel.slug}/${prev.slug}`}>Previous</Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                )}
                {next ? (
                    <Button asChild size="sm">
                        <Link href={`/novels/${novel.slug}/${next.slug}`}>Next</Link>
                    </Button>
                ) : (
                    <Button size="sm" disabled>
                        Next
                    </Button>
                )}
            </div>
        </main>
    )
}
