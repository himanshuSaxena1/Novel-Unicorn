import HeroCarousel from '@/components/HeroCarousel'
import HomePage from '@/components/Home'
import { Button } from '@/components/ui/button';
import { NovelAPI } from '@/lib/api';
import Link from 'next/link';
import React from 'react'

const page = async () => {
  const response = await NovelAPI.getFeaturedNovels(8);

  const data = await response
  const featuredNovels = data

  return (
    <div className='min-h-screen  bg-background'>
      <div className='max-w-6xl mx-auto'>
        <HeroCarousel initialNovels={featuredNovels} />
        <HomePage />
      </div>
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

export default page
