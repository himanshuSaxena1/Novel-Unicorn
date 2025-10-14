import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NovelCard from '@/components/NovelCard'
import { Search, TrendingUp, Clock, Star, ArrowRight, BookOpen, Users, Award } from 'lucide-react'

export default function HomePage({ recentNovels, trendingNovels }: any) {



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
        </div>
    )
}