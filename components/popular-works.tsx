"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"

const GENRES = [
    { label: "entire", value: "entire" },
    { label: "fantasy", value: "Fantasy" },
    { label: "martial arts", value: "Martial Arts" },
    { label: "Romance", value: "Romance" },
    { label: "Modern fantasy", value: "Modern Fantasy" },
    { label: "Light novel", value: "Light Novel" },
    { label: "horror", value: "Horror" },
    { label: "SF", value: "Sci-Fi" },
    { label: "sports", value: "Sports" },
    { label: "Alternative history", value: "Alternative History" },
]

export type PopularNovel = {
    id: string
    title: string
    slug: string
    cover: string | null
    author: {
        username: string
    }
    genres: string[]
    rating: number | null
    views: number
    chapterCount: number
}

interface PopularWorksProps {
    initialNovels?: PopularNovel[]
}

export default function PopularWorks({ initialNovels = [] }: PopularWorksProps) {
    const [selectedGenre, setSelectedGenre] = useState("entire")
    const [novels, setNovels] = useState<PopularNovel[]>(initialNovels)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchNovels() {
            setLoading(true)
            const res = await api.get(`/novels/popular?genre=${selectedGenre}`)
            const data = await res.data
            setNovels(data)
            setLoading(false)
        }

        fetchNovels()
    }, [selectedGenre])

    // Group novels into chunks of 3 for mobile columns
    const mobileColumns: PopularNovel[][] = []
    if (!loading && novels.length > 0) {
        for (let i = 0; i < novels.length; i += 3) {
            mobileColumns.push(novels.slice(i, i + 3))
        }
    }

    return (
        <section className="w-full bg-background py-12 px-4">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="mb-2 text-balance text-3xl font-bold text-foreground md:text-4xl">Popular works</h2>
                    <div className="flex items-baseline justify-start gap-2 text-muted-foreground">
                        <span className="text-sm">Real-time data from users</span>
                        <span className="text-sm font-medium text-primary">Views</span>
                    </div>
                </div>

                {/* Genre Filter */}
                <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 min-w-max">
                        {GENRES.map((genre) => (
                            <Button
                                key={genre.value}
                                variant={selectedGenre === genre.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedGenre(genre.value)}
                                className="whitespace-nowrap"
                            >
                                {genre.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Novels Display */}
                {loading ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="animate-pulse flex items-center gap-4">
                                <div className="h-28 w-20 rounded bg-muted mb-4" />
                                <div className="w-full">
                                    <div className="h-5 w-3/4 rounded bg-muted mb-2" />
                                    <div className="h-4 w-1/2 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Mobile: Horizontal scroll with full columns of 3 novels each */}
                        <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide sm:hidden">
                            <div className="flex gap-6 pb-6">
                                {mobileColumns.map((column, colIndex) => (
                                    <div key={colIndex} className="flex-shrink-0 w-[85vw] flex flex-col gap-8">
                                        {column.map((novel, idxInCol) => {
                                            return (
                                                <Link
                                                    key={novel.id}
                                                    href={`/novel/${novel.slug}`}
                                                    className="group relative flex gap-4 rounded-lg transition-all hover:border-primary "
                                                >


                                                    {/* Cover Image */}
                                                    <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded">
                                                        {novel.cover ? (
                                                            <Image
                                                                src={novel.cover || "/placeholder.svg"}
                                                                alt={novel.title}
                                                                fill
                                                                className="object-cover transition-transform group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                                <span className="text-xs text-muted-foreground">No cover</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                                                        <div className="flex items-center gap-2">
                                                            {/* Rank Number */}
                                                            <div className="flex-shrink-0">
                                                                <span className="text-2xl font-bold text-muted-foreground">{colIndex + 1}</span>
                                                            </div>
                                                            <h3 className="mb-1 text-pretty text-sm font-semibold text-foreground group-hover:text-primary line-clamp-1">
                                                                {novel.title}
                                                            </h3>
                                                        </div>
                                                        {/* Genres */}
                                                        <div className="flex flex-wrap gap-1">
                                                            {novel.genres.slice(0, 3).map((genre) => (
                                                                <span key={genre} className="text-xs text-yellow-600 dark:text-yellow-500">
                                                                    {genre}
                                                                    {novel.genres.indexOf(genre) < Math.min(novel.genres.length - 1, 2) && " • "}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop/Tablet: Exact same card UI in grid */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {novels.map((novel, index) => (
                                <Link
                                    key={novel.id}
                                    href={`/novel/${novel.slug}`}
                                    className="group relative flex gap-4 rounded-lg transition-all hover:border-primary "
                                >


                                    {/* Cover Image */}
                                    <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded">
                                        {novel.cover ? (
                                            <Image
                                                src={novel.cover || "/placeholder.svg"}
                                                alt={novel.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                <span className="text-xs text-muted-foreground">No cover</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            {/* Rank Number */}
                                            <div className="flex-shrink-0">
                                                <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>
                                            </div>
                                            <h3 className="mb-1 text-pretty text-sm font-semibold text-foreground group-hover:text-primary line-clamp-1">
                                                {novel.title}
                                            </h3>
                                        </div>

                                        {/* Genres */}
                                        <div className="flex flex-wrap gap-1">
                                            {novel.genres.slice(0, 3).map((genre) => (
                                                <span key={genre} className="text-xs text-yellow-600 dark:text-yellow-500">
                                                    {genre}
                                                    {novel.genres.indexOf(genre) < Math.min(novel.genres.length - 1, 2) && " • "}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && novels.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">No novels found for this genre.</p>
                    </div>
                )}
            </div>
        </section>
    )
}