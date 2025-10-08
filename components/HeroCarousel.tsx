'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Star, Eye, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Novel {
  id: string
  title: string
  slug: string
  description: string
  cover: string
  author: { username: string }
  rating: number
  views: number
  genres: string[]
  chapterCount: number
  latestChapter?: { title: string }
}

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    autoplay: { delay: 5000 }
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { data: novels = [], isLoading } = useQuery({
    queryKey: ['featured-novels'],
    queryFn: async () => {
      const response = await fetch('/api/novels/featured')
      if (!response.ok) throw new Error('Failed to fetch featured novels')
      return response.json()
    }
  })

  useEffect( () => {
    if (!emblaApi) return undefined

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    onSelect()

    return () => emblaApi.off('select', onSelect)
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  if (isLoading) {
    return (
      <div className="relative h-[600px] bg-gradient-to-r from-primary/20 to-blue-600/20 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-8 w-64 bg-muted rounded mx-auto"></div>
            <div className="h-4 w-96 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {novels.map((novel: Novel, index: number) => (
            <div key={novel.id} className="embla__slide relative flex-[0_0_100%] min-w-0">
              {/* Background Image with Blur */}
              <div className="absolute inset-0">
                <Image
                  src={novel.cover || 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg'}
                  alt={novel.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Novel Cover */}
                    <div className="flex justify-center lg:justify-end">
                      <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <Image
                          src={novel.cover || 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg'}
                          alt={novel.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/90 text-white">
                            Featured
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Novel Info */}
                    <div className="text-white space-y-6">
                      <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                          {novel.title}
                        </h1>
                        <p className="text-xl text-gray-200">
                          by {novel.author.username}
                        </p>
                      </div>

                      <p className="text-lg text-gray-300 line-clamp-3 max-w-2xl">
                        {novel.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{novel.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{novel.views?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{novel.chapterCount || 0} chapters</span>
                        </div>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2">
                        {novel.genres?.slice(0, 4).map((genre) => (
                          <Badge key={genre} variant="secondary" className="bg-white/20 text-white border-white/30">
                            {genre}
                          </Badge>
                        ))}
                      </div>

                      {/* Latest Chapter */}
                      {novel.latestChapter && (
                        <div className="text-sm text-gray-300">
                          Latest: {novel.latestChapter.title}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-4">
                        <Button size="lg" asChild>
                          <Link href={`/novel/${novel.slug}`}>
                            Start Reading
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                          Add to Library
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 border-white/30 text-white hover:bg-white hover:text-black"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 border-white/30 text-white hover:bg-white hover:text-black"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {novels.map((_: any, index: number) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}