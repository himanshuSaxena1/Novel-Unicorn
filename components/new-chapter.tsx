import Image from "next/image"
import Link from "next/link"
import { NovelAPI } from "@/lib/api"
import { Clock, Star } from "lucide-react"
import { formatTimeAgo } from "@/lib/utils"

export default async function NewChapter() {
    const novels = await NovelAPI.getLatestUpdatedNovels(10)

    if (!novels.length) return null

    return (
        <section className="py-10 md:px-4 mx-auto max-w-6xl ">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <h2 className="text-xl md:text-3xl font-bold flex items-center">
                        <Clock className="mr-3 h-6 w-6 text-blue-500" />
                        New Chapters
                    </h2>
                    <p className="text-muted-foreground">Fresh chapters just released</p>
                </div>
            </div>
            <div className="space-y-4">
                {novels.map((novel) => (
                    <div
                        key={novel.id}
                        className="relative flex items-center gap-4 rounded-xl border border-border/60 
                       
                       p-4 shadow-sm"
                    >
                        {/* Cover */}
                        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md">
                            {novel.cover ? (
                                <Image
                                    src={novel.cover}
                                    alt={novel.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between overflow-hidden">
                            <div>
                                <h3 className="line-clamp-1 text-sm font-semibold dark:text-white">
                                    {novel.title}
                                </h3>

                                <p className="mt-1 line-clamp-1 text-xs dark:text-zinc-300">
                                    Ch : {novel.latestChapter?.title ?? "New chapter released"}
                                </p>
                            </div>

                            {/* Meta */}
                            <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatTimeAgo(novel.updatedAt)}
                                </span>

                                <span className="flex items-center gap-1 text-yellow-400">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                                    {novel.rating ?? 0}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href={`/novel/${novel.slug}`}
                            className="ml-auto shrink-0 rounded-md bg-gradient-to-br from-blue-800 via-slate-700 to-black px-4 py-2 
                         text-xs font-semibold text-white transition hover:bg-violet-600"
                        >
                            Read Now
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
