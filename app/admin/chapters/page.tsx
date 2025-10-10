'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  FileText,
  Lock,
  Crown,
  RefreshCcw
} from 'lucide-react'
import toast from 'react-hot-toast'

const ACCESS_TIER_COLORS = {
  FREE: 'bg-green-500',
  SMALL: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  PREMIUM: 'bg-purple-500'
}

export default function AdminChaptersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [accessFilter, setAccessFilter] = useState('ALL')
  const [selectedNovel, setSelectedNovel] = useState('ALL')
  const [page, setPage] = useState(1)
  const [refreshToggle, setRefreshToggle] = useState(false)

  // Fetch chapters
  const { data: chaptersData, isLoading: chaptersLoading, refetch } = useQuery({
    queryKey: ['admin-chapters', page, searchQuery, accessFilter, selectedNovel],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      if (searchQuery) params.set('search', searchQuery)
      if (accessFilter !== 'ALL') params.set('accessTier', accessFilter)
      if (selectedNovel !== 'ALL') params.set('novelId', selectedNovel)

      const response = await fetch(`/api/admin/chapters?${params}`)
      if (!response.ok) throw new Error('Failed to fetch chapters')
      return response.json()
    }
  })

  // Fetch novels for filter dropdown
  const { data: novels = [] } = useQuery({
    queryKey: ['novels-list'],
    queryFn: async () => {
      const response = await fetch('/api/novels?limit=100')
      if (!response.ok) throw new Error('Failed to fetch novels')
      const data = await response.json()
      return data.novels || []
    }
  })

  const handleDelete = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return

    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete chapter')

      toast.success('Chapter deleted successfully')
      refetch()
    } catch (error) {
      toast.error('Failed to delete chapter')
    }
  }

  const handleTogglePublish = async (chapterId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      })

      if (!response.ok) throw new Error('Failed to update chapter')

      toast.success(`Chapter ${!isPublished ? 'published' : 'unpublished'} successfully`)
      refetch()
    } catch (error) {
      toast.error('Failed to update chapter')
    }
  }

  const chapters = chaptersData?.chapters || []
  const stats = {
    total: chaptersData?.total || 0,
    published: chapters.filter((c: any) => c.isPublished).length,
    premium: chapters.filter((c: any) => c.accessTier === 'PREMIUM').length,
    totalViews: chapters.reduce((sum: number, chapter: any) => sum + (chapter.views || 0), 0)
  }

  function handleRefresh() {
    setRefreshToggle(true)
    refetch().finally(() => setRefreshToggle(false))
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chapters Management</h1>
          <p className="text-muted-foreground">Manage all chapters across novels</p>
        </div>
        <Button asChild>
          <Link href="/admin/chapters/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Only</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chapters or novels..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedNovel} onValueChange={setSelectedNovel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Novel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Novels</SelectItem>
            {novels.map((novel: any) => (
              <SelectItem key={novel.id} value={novel.id}>
                {novel.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Access: {accessFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setAccessFilter('ALL')}>
              All Tiers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAccessFilter('FREE')}>
              Free
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAccessFilter('SMALL')}>
              Small
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAccessFilter('MEDIUM')}>
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAccessFilter('PREMIUM')}>
              Premium
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={handleRefresh}>
          {
            refreshToggle ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />
          }
        </Button>
      </div>

      {/* Chapters Table */}
      <Card>
        <CardContent className="p-0">
          {chaptersLoading ? (
            <div className="p-8 text-center">Loading chapters...</div>
          ) : chapters.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No chapters found. <Link href="/admin/chapters/create" className="text-primary hover:underline">Create your first chapter</Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Novel</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chapters.map((chapter: any) => (
                  <TableRow key={chapter.id}>
                    <TableCell>
                      <div className="font-medium">{chapter.title}</div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/novel/${chapter.novel.slug}`}
                        className="text-primary hover:underline"
                      >
                        {chapter.novel.title}
                      </Link>
                    </TableCell>
                    <TableCell>#{chapter.order}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${ACCESS_TIER_COLORS[chapter.accessTier as keyof typeof ACCESS_TIER_COLORS]}`} />
                        <span>{chapter.accessTier}</span>
                        {chapter.accessTier !== 'FREE' && <Lock className="h-3 w-3" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={chapter.isLocked ? 'default' : 'secondary'}>
                        {chapter.isLocked ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{(chapter.views || 0).toLocaleString()}</TableCell>
                    <TableCell>{(chapter.wordCount || 0).toLocaleString()}</TableCell>
                    <TableCell>{new Date(chapter.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/novel/${chapter.novel.slug}/chapter/${chapter.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/chapters/${chapter.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTogglePublish(chapter.id, chapter.isPublished)}
                          >
                            {chapter.isPublished ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(chapter.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {chaptersData?.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, chaptersData.pages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'outline'}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            disabled={page === chaptersData.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}