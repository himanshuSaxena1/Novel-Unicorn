"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, Eye, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  language: string
}

export default function HeroCarousel({ initialNovels = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { data: novels = initialNovels } = useQuery({
    queryKey: ["featured-novels"],
    queryFn: async () => {
      const response = await fetch("/api/novels/featured")
      if (!response.ok) throw new Error("Failed to fetch featured novels")
      return response.json()
    },
    initialData: initialNovels, // Use initial data from server
  })

  const slides: Novel[] = useMemo(() => {
    const map = new Map<string, Novel>()
    for (const n of novels) {
      const key = n.slug || n.id
      if (map.has(key)) console.warn(`Duplicate novel detected: ${key}`)
      else map.set(key, n)
    }
    return Array.from(map.values())
  }, [novels])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit({ loop: slides.length > 1, slidesToScroll: 1 })
  }, [emblaApi, slides.length])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])


  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return
    const id = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => clearInterval(id)
  }, [emblaApi, slides.length])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  if (slides.length === 0) {
    return (
      <div className="relative h-[600px] flex items-center justify-center">
        <p className="text-white text-lg">No featured novels available.</p>
      </div>
    )
  }

  return (
    <div className="relative h-[600px]">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex h-[600px]">
          {slides.map((novel, index) => (
            <div key={novel.slug ?? novel.id} className="embla__slide relative flex-[0_0_100%] min-w-0 w-full">
              <div className="absolute inset-0">
                <Image
                  src={novel.cover || "https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg"}
                  alt={novel.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              </div>
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-center gap-8 items-center px-0 md:px-2 lg:px-6 xl:px-10 2xl:px-16">
                    <div className="flex justify-center items-center">
                      <div className="relative w-56 md:w-60 md:h-80 h-72 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <Image
                          src={novel.cover || "https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg"}
                          alt={novel.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-600 text-white hover:bg-primary-foreground">Featured</Badge>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-600 text-white hover:bg-primary-foreground">{novel.language}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-white space-y-3 md:space-y-6 flex-1">
                      <div className="space-y-2">
                        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-bold leading-tight">
                          {novel.title}
                        </h1>
                      </div>
                      <p className="text-xs md:text-base text-gray-300 line-clamp-2 md:line-clamp-3 max-w-2xl">{novel.description}</p>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{novel.rating?.toFixed(1) || "0.0"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{novel.views?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{novel.chapterCount || 0} chapters</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {novel.genres?.slice(0, 4).map((genre) => (
                          <Badge key={genre} variant="secondary" className="bg-white/20 text-white border-white/30">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      {novel.latestChapter && (
                        <div className="text-sm text-gray-300 hidden md:flex">Latest: {novel.latestChapter.title}</div>
                      )}
                      <div className="flex space-x-4">
                        <Button size="lg" asChild>
                          <Link href={`/novel/${novel.slug}`}>Start Reading</Link>
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-white text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black bg-transparent"
                        >
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
      {slides.length > 1 && (
        <>
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
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? "bg-white" : "bg-white/50"
                  }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}