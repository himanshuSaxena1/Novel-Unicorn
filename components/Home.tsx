import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NovelCard from '@/components/NovelCard'
import { Search, TrendingUp, Clock, Star, ArrowRight, BookOpen, Users, Award } from 'lucide-react'
import PopularWorks from './popular-works'

export default function HomePage({ recentNovels, trendingNovels, popularNovels }: any) {



    return (
        <div className="min-h-screen  ">
            <div className=''>
                {/* Trending Section */}
                <section className="bg-gradient-to-t from-lime-300/60 dark:from-red-300 via-green-100 to-violet-100 dark:to-yellow-100">
                    <div className="py-8 md:py-16 px-4 max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="space-y-2">
                                <h2 className="text-xl md:text-3xl text-black  font-bold flex items-center">
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

                        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 z-50">
                            <div className="flex gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 py-2">
                                {trendingNovels.slice(0, 6).map((novel: any, index: number) => (
                                    <div key={novel.id} className="relative min-w-[140px] sm:min-w-0">
                                        <Badge className="absolute -top-2 -left-3 z-10 bg-green-500 text-white border border-white">
                                            #{index + 1}
                                        </Badge>
                                        <NovelCard {...novel} showDetails={false} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                <PopularWorks initialNovels={popularNovels} />

                {/* Recently Updated */}
                <section className="">
                    <div className="py-8 md:py-16 px-4 max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
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

                        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="flex gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 py-2">
                                {recentNovels.novels?.slice(0, 6).map((novel: any) => (
                                    <div key={novel.id} className="min-w-[140px] sm:min-w-0">
                                        <NovelCard {...novel} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
            </div>
            {/* Premium CTA Section */}
        </div>
    )
}