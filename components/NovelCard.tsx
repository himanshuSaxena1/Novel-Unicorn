import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Star, Clock, Lock } from 'lucide-react'

interface NovelCardProps {
  id: string
  title: string
  slug: string
  description?: string
  cover?: string
  author: { username: string } | string
  rating: number
  views: number
  genres: string[]
  status: string
  viewMode?: 'grid' | 'list'
  latestChapter?: {
    title: string
    accessTier: string
  }
  showDetails?: boolean
  language?: string
}

export default function NovelCard({
  id,
  title,
  slug,
  description,
  cover,
  author,
  rating,
  views,
  genres,
  status,
  viewMode = 'grid',
  latestChapter,
  showDetails,
  language,
}: NovelCardProps) {
  const authorName = typeof author === 'string' ? author : author.username

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-1.5 xl:p-6">
          <div className="flex space-x-4">
            <div className="flex-shrink-0 h-max">
              <div className="w-24 h-32 relative rounded-lg overflow-hidden">
                <Image
                  src={cover || 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg'}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-base leading-6 group-hover:text-primary transition-colors">
                  <Link href={`/novel/${slug}`}>
                    {title}
                  </Link>
                </h3>
                <p className="text-xs text-muted-foreground">by Unique Novels</p>
              </div>

              {description && (
                <p className="text-xs xl:text-sm text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 sm:space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className='text-xs sm:text-sm'>{rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span className='text-xs sm:text-sm'>{views.toLocaleString()}</span>
                  </div>
                  <Badge className='text-xs md:text-sm px-1 md:px-2' variant={status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {status}
                  </Badge>
                  <Badge className='text-xs md:text-sm px-1 md:px-2' variant={language === 'KOREAN' ? 'default' : language === 'JAPANESE' ? 'secondary' : 'outline'}>
                    {language}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-primary/5">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="aspect-[3/4] relative">
          <Image
            src={cover || 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          <Badge
            className="absolute top-2 right-2"
            variant={status === 'COMPLETED' ? 'default' : 'secondary'}
          >
            {status}
          </Badge>
          {/* Language Badge */}
          <Badge className="absolute top-2 left-2" variant={language === 'KOREAN' ? 'default' : language === 'JAPANESE' ? 'secondary' : 'default'}>
            {language}
          </Badge>

          {/* Quick Actions */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" className="w-full" asChild>
              <Link href={`/novel/${slug}`}>
                Read Now
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-2 space-y-3 ">
        <div>
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/novel/${slug}`}>
              {title}
            </Link>
          </h3>
        </div>
        {
          showDetails && (
            <div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{views.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>2d ago</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                {genres.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{genres.length - 3}
                  </Badge>
                )}
              </div>

              {/* Latest Chapter */}
              {latestChapter && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Latest: {latestChapter.title}
                    </p>
                    {latestChapter.accessTier !== 'FREE' && (
                      <Lock className="h-3 w-3 text-yellow-600" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        }


      </CardContent>
    </Card >
  )
}