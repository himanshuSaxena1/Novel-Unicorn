export const dynamic = "force-dynamic";
export const revalidate = 0;

import HeroCarousel from '@/components/HeroCarousel'
import HomePage from '@/components/Home'
import NewChapter from '@/components/new-chapter';
import { Button } from '@/components/ui/button';
import { NovelAPI } from '@/lib/api';
import Link from 'next/link';
import React, { Suspense } from 'react'

export default async function page() {
  const response = await NovelAPI.getFeaturedNovels(8);
  const featuredNovels = await response;

  // const { data: trendingNovels = [] } = useQuery({
  //   queryKey: ['trending-novels'],
  //   queryFn: async () => {
  //     const response = await fetch('/api/novels/trending')
  //     if (!response.ok) throw new Error('Failed to fetch trending novels')
  //     return response.json()
  //   }
  // })

  const trendingNovels = await NovelAPI.getTrendingNovels(10)

  const result = await NovelAPI.getNovelsByFilters()
  const dataa = await result

  const popularNovels = await NovelAPI.getPopularNovels(undefined, 9)

  // const { data: recentNovels = [] } = useQuery({
  //   queryKey: ['recent-novels'],
  //   queryFn: async () => {
  //     const response = await fetch('/api/novels?limit=8&sortBy=updatedAt')
  //     if (!response.ok) throw new Error('Failed to fetch recent novels')
  //     return response.json()
  //   }
  // })

  return (
    <div className='min-h-screen  bg-background'>
      <div className=''>
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <HeroCarousel initialNovels={featuredNovels} />
        </Suspense>
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <HomePage trendingNovels={trendingNovels} recentNovels={dataa} popularNovels={popularNovels} />
        </Suspense>
      </div>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <NewChapter />
      </Suspense>

      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <section className="py-8 px-4 bg-gradient-to-r from-primary/60 to-blue-800">
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
      </Suspense>
    </div>
  )
}

