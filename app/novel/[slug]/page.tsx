import Image from "next/image"
import Link from "next/link"
import { getNovelBySlug } from "@/lib/queries"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, BookOpen, Eye, CoinsIcon } from "lucide-react"
import { NovelNotFound } from "@/components/NovelNotFound"
import { ExpandableSummary } from "@/components/ExpandableSummary"
import BookMark from "@/components/BookMark"
import Reviews from "@/components/novel/review"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function NovelPage({ params }: { params: { slug: string } }) {
    const session = await getServerSession(authOptions);
    const novel = await getNovelBySlug(params.slug, session?.user?.id)

    if (!novel) return <NovelNotFound />;

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 md:py-12 min-h-[70vh]">
            {/* Header Section */}
            <div className="grid gap-4 md:gap-8 md:grid-cols-[280px,1fr] items-start">
                {/* Cover + Title (Mobile Header) */}
                <div className="flex gap-4 md:block">
                    {/* Cover */}
                    <div className="relative aspect-[3/4] w-28 md:w-60 shrink-0 overflow-hidden rounded-lg border bg-muted shadow-sm">
                        <Image
                            src={novel.cover || "/placeholder.svg?height=400&width=300"}
                            alt={`${novel.title} cover`}
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Status Badge */}
                        <Badge
                            className="hidden md:inline absolute top-2 right-2 text-xs"
                            variant={novel.status === "COMPLETED" ? "default" : "secondary"}
                        >
                            {novel.status}
                        </Badge>

                        {/* Language Badge */}
                        <Badge
                            className="hidden md:inline absolute top-2 left-2 text-xs"
                            variant="secondary"
                        >
                            {novel.language}
                        </Badge>
                    </div>

                    {/* Mobile Title + Meta */}
                    <div className="flex flex-col justify-between md:hidden">
                        <div>
                            <h1 className="text-lg mt-1 font-bold leading-tight">
                                {novel.title}
                            </h1>
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm text-muted-foreground mt-1">
                                    by: <span className="text-primary">Unique Novels</span>
                                </p>
                                <p className="md:hidden text-sm text-muted-foreground mt-1">
                                    Language: <span className="text-primary">{novel.language}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Novel Info (Desktop + Shared) */}
                <div className="space-y-4">
                    {/* Desktop Title */}
                    <div className="hidden md:block">
                        <h1 className="text-2xl xl:text-3xl font-bold tracking-tight">
                            {novel.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            by <span className="text-primary">Unique Novels</span>
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {novel.chapters.length} Chapters
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {novel.views?.toLocaleString() ?? 0} Views
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(novel.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </div>

                    {/* Genres & Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {(novel.genres || []).map((genre: string) => (
                            <Badge key={genre} variant="secondary">
                                #{genre}
                            </Badge>
                        ))}
                        {(novel.tags || []).slice(0, 4).map((tag: string) => (
                            <Badge key={tag}>{tag}</Badge>
                        ))}
                    </div>

                    {/* Description */}
                    <ExpandableSummary summary={novel.description || "No description available."} />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {novel.chapters.length > 0 && (
                            <Button asChild size="lg">
                                <Link
                                    href={
                                        novel.continueReading
                                            ? `/novel/${novel.slug}/chapter/${novel.continueReading.slug}`
                                            : `/novel/${novel.slug}/chapter/${novel.chapters[0].slug}`
                                    }
                                >
                                    {novel.continueReading ? "Continue Reading" : "Start Reading"}
                                </Link>
                            </Button>
                        )}
                        <BookMark
                            novelId={novel.id}
                            novelSlug={novel.slug}
                            isBookMarked={novel.isBookmarked}
                        />
                    </div>
                </div>
            </div>


            {/* Tabs for Chapters and Reviews */}
            <section className="mt-12">
                <Tabs defaultValue="chapters" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="chapters">Chapters</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chapters">
                        <Card>
                            <CardContent className="p-0 divide-y">
                                {novel.chapters.length === 0 && (
                                    <p className="p-4 text-sm text-muted-foreground">
                                        No chapters available.
                                    </p>
                                )}
                                {novel.chapters
                                    .filter((c: { isPublished: boolean }) => c.isPublished)
                                    .sort(
                                        (
                                            a: { order: number },
                                            b: { order: number }
                                        ) => a.order - b.order
                                    )
                                    .map((chapter: { slug: string; order: number; title: string; views: number; isLocked: boolean; priceCoins: number }) => (
                                        <Link
                                            key={chapter.slug}
                                            href={`/novel/${novel.slug}/chapter/${chapter.slug}`}
                                            className="group flex items-center justify-between px-2 md:px-4 py-3 transition-colors hover:bg-accent/50"
                                        >
                                            <div className="text-sm md:text-base flex items-center">
                                                <span className="text-sm text-muted-foreground mr-2">
                                                    #{chapter.order}
                                                </span>
                                                <span className="font-medium group-hover:text-primary line-clamp-1">
                                                    {chapter.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">

                                                {chapter.isLocked ? (
                                                    <span className="border border-yellow-600 px-2 py-2 rounded-md flex items-center gap-1">
                                                        {chapter.priceCoins}
                                                        <CoinsIcon className="w-4 h-4 text-yellow-600" />
                                                    </span>
                                                ) : (
                                                    <div className="border border-white/50 flex items-center gap-1 rounded px-1 py-1.5">
                                                        READ
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {chapter.views?.toLocaleString() ?? 0}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reviews">
                        <Reviews novelId={novel.id} slug={novel.slug} userId={session?.user?.id} />
                    </TabsContent>
                </Tabs>
            </section>
        </main>
    )
}