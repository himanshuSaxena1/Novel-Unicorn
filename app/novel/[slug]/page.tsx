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
            <div className="grid gap-8 md:grid-cols-[280px,1fr] items-start">
                {/* Cover */}
                <div className="flex justify-center md:justify-start">
                    <div className="relative aspect-[3/4] w-60 overflow-hidden rounded-lg border bg-muted shadow-sm">
                        <Image
                            src={
                                novel.cover ||
                                "/placeholder.svg?height=400&width=300&query=novel%20cover"
                            }
                            alt={`${novel.title} cover`}
                            width={300}
                            height={400}
                            className="h-full w-full object-cover"
                            priority
                        />
                        {/* Status Badge */}
                        <Badge
                            className="absolute top-2 right-2"
                            variant={novel.status === 'COMPLETED' ? 'default' : 'secondary'}
                        >
                            {novel.status}
                        </Badge>
                        {/* Language Badge */}
                        <Badge className="absolute top-2 left-2" variant={novel.language === 'KOREAN' ? 'default' : novel.language === 'JAPANESE' ? 'secondary' : 'default'}>
                            {novel.language}
                        </Badge>
                    </div>
                </div>

                {/* Novel Info */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-xl md:text-2xl xl:text-3xl font-bold tracking-tight text-foreground">
                            {novel.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            by{" "}
                            <Link
                                href={`/author/${novel.author.id}`}
                                className="text-primary hover:underline"
                            >
                                {novel.author.username || 'Unique Novels'}
                            </Link>
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{novel.chapters.length} Chapters</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{novel.views?.toLocaleString() ?? 0} Views</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                                {new Date(novel.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
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
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        <ExpandableSummary summary={novel.description || "No description available."} />
                    </p>

                    {/* Start Reading Button */}
                    <div className="flex items-center gap-2">
                        {novel.chapters.length > 0 && (
                            <Button asChild size="lg" className="">
                                <Link href={`/novel/${novel.slug}/chapter/${novel.chapters[0].slug}`}>
                                    Start Reading
                                </Link>
                            </Button>
                        )}
                        <BookMark
                            novelId={novel.id as string}
                            novelSlug={novel.slug as string}
                            isBookMarked={novel.isBookmarked as boolean}
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
                                                        {/* <Eye className="h-3 w-3" /> */}
                                                        {/* {chapter.views?.toLocaleString() ?? 'Read'} */}
                                                        READ
                                                    </div>
                                                )}
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