'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NovelCard from '@/components/NovelCard'
import { Search, TrendingUp, Clock, Star, ArrowRight, BookOpen, Users, Award } from 'lucide-react'

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('')

    const { data: trendingNovels = [] } = useQuery({
        queryKey: ['trending-novels'],
        queryFn: async () => {
            const response = await fetch('/api/novels/trending')
            if (!response.ok) throw new Error('Failed to fetch trending novels')
            return response.json()
        }
    })

    const { data: recentNovels = [] } = useQuery({
        queryKey: ['recent-novels'],
        queryFn: async () => {
            const response = await fetch('/api/novels?limit=8&sortBy=updatedAt')
            if (!response.ok) throw new Error('Failed to fetch recent novels')
            return response.json()
        }
    })

    return (
        <div className="min-h-screen  bg-background">
            <div className='max-w-6xl mx-auto'>

                {/* Hero Section */}
                

                {/* Trending Section */}

                <section className="py-16 px-4 bg-muted/30">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-2">
                                <h2 className="text-xl md:text-3xl font-bold flex items-center">
                                    <TrendingUp className="mr-3 h-6 w-6 text-green-500" />
                                    Trending Now
                                </h2>
                                <p className="text-muted-foreground text-sm">Most popular stories this week</p>
                            </div>
                            <Button className='text-sm md:text-base' variant="outline" asChild>
                                <Link href="/browse?section=trending">
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
                            {trendingNovels.slice(0, 5).map((novel: any, index: number) => (
                                <div key={novel.id} className="relative">
                                    <Badge className="absolute -top-2 -left-2 z-10 bg-green-500 text-white">
                                        #{index + 1}
                                    </Badge>
                                    <NovelCard {...novel} showDetails={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recently Updated */}
                <section className="py-16 px-4">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-2">
                                <h2 className="text-xl md:text-3xl font-bold flex items-center">
                                    <Clock className="mr-3 h-6 w-6 text-blue-500" />
                                    Recently Updated
                                </h2>
                                <p className="text-muted-foreground">Fresh chapters just released</p>
                            </div>
                            <Button className='text-sm md:text-base' variant="outline" asChild>
                                <Link href="/browse?section=recent">
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
                            {recentNovels.novels?.slice(0, 4).map((novel: any) => (
                                <NovelCard key={novel.id} {...novel} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            {/* Premium CTA Section */}
            <section className="py-8 px-4 bg-gradient-to-r from-primary/70 to-blue-700">
                <div className="container mx-auto text-center text-white">
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold">Unlock Premium Content</h2>
                        <p className="text-xl opacity-90">
                            Get access to exclusive novels, early chapter releases, and ad-free reading experience
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/coins">
                                    View Plans
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-black dark:hover:bg-black hover:bg-black hover:text-white dark:bg-white" asChild>
                                <Link href="/browse?tier=premium">
                                    Browse Premium
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}