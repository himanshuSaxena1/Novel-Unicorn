'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import NovelCard from '@/components/NovelCard'
import { Search, Filter, SlidersHorizontal, Grid, List } from 'lucide-react'

const GENRES = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller', 'Horror',
  'Adventure', 'Drama', 'Comedy', 'Action', 'Cultivation', 'System',
  'Reincarnation', 'Magic', 'School', 'Martial Arts', 'Gaming', 'VR'
]

const STATUS_OPTIONS = [
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'HIATUS', label: 'Hiatus' },
  { value: 'DROPPED', label: 'Dropped' }
]

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'views-desc', label: 'Most Popular' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'title-asc', label: 'A-Z' },
  { value: 'title-desc', label: 'Z-A' }
]

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genres: searchParams.get('genres')?.split(',') || [],
    status: searchParams.get('status') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page') || '1')
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['browse-novels', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters.search) params.set('search', filters.search)
      if (filters.genres.length > 0) params.set('genres', filters.genres.join(','))
      if (filters.status) params.set('status', filters.status)
      params.set('sortBy', filters.sortBy)
      params.set('sortOrder', filters.sortOrder)
      params.set('page', filters.page.toString())
      params.set('limit', '12')

      const response = await fetch(`/api/novels?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch novels')
      return response.json()
    }
  })

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const toggleGenre = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre]
    updateFilters({ genres: newGenres })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      genres: [],
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search novels, authors, genres..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
            </div>

            {/* Sort */}
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-')
                updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' })
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>

          {/* Active Filters */}
          {(filters.genres.length > 0 || filters.status) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => toggleGenre(genre)}>
                  {genre} ×
                </Badge>
              ))}
              {filters.status && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilters({ status: '' })}>
                  {STATUS_OPTIONS.find(s => s.value === filters.status)?.label} ×
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 relative">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1 absolute right-0 -top-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Status</h4>
                    <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allstatus">All Status</SelectItem>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Genre Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Genres</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {GENRES.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={genre}
                            checked={filters.genres.includes(genre)}
                            onCheckedChange={() => toggleGenre(genre)}
                          />
                          <label htmlFor={genre} className="text-sm cursor-pointer">
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-4' : 'lg:col-span-6'}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load novels. Please try again.</p>
              </div>
            ) : data?.novels?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No novels found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">
                    Showing {data?.novels?.length || 0} of {data?.total || 0} novels
                  </p>
                </div>

                {/* Novels Grid */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4' 
                    : 'grid-cols-1'
                }`}>
                  {data?.novels?.map((novel: any) => (
                    <NovelCard key={novel.id} {...novel} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => updateFilters({ page: filters.page - 1 })}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, data.pages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={filters.page === page ? 'default' : 'outline'}
                          onClick={() => updateFilters({ page })}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      disabled={filters.page === data.pages}
                      onClick={() => updateFilters({ page: filters.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}