'use client'

import { useState } from 'react'
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
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  FileText,
  Lock,
  Crown
} from 'lucide-react'

// Mock data
const CHAPTERS = [
  {
    id: '1',
    title: 'Chapter 1: The Beginning',
    novel: { title: 'Immortal Cultivator Path', slug: 'immortal-cultivator' },
    order: 1,
    accessTier: 'FREE',
    isPublished: true,
    views: 15420,
    wordCount: 2340,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Chapter 2: First Steps',
    novel: { title: 'Immortal Cultivator Path', slug: 'immortal-cultivator' },
    order: 2,
    accessTier: 'FREE',
    isPublished: true,
    views: 12340,
    wordCount: 2180,
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    title: 'Chapter 50: Hidden Power',
    novel: { title: 'Immortal Cultivator Path', slug: 'immortal-cultivator' },
    order: 50,
    accessTier: 'SMALL',
    isPublished: true,
    views: 8940,
    wordCount: 2650,
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    title: 'Chapter 100: Breaking Through',
    novel: { title: 'Immortal Cultivator Path', slug: 'immortal-cultivator' },
    order: 100,
    accessTier: 'PREMIUM',
    isPublished: false,
    views: 0,
    wordCount: 2890,
    createdAt: '2024-03-25'
  }
]

const ACCESS_TIER_COLORS = {
  FREE: 'bg-green-500',
  SMALL: 'bg-blue-500', 
  MEDIUM: 'bg-yellow-500',
  PREMIUM: 'bg-purple-500'
}

export default function AdminChaptersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [accessFilter, setAccessFilter] = useState('ALL')

  const filteredChapters = CHAPTERS.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chapter.novel.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAccess = accessFilter === 'ALL' || chapter.accessTier === accessFilter
    return matchesSearch && matchesAccess
  })

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
            <div className="text-2xl font-bold">{CHAPTERS.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CHAPTERS.filter(c => c.isPublished).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Only</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CHAPTERS.filter(c => c.accessTier === 'PREMIUM').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {CHAPTERS.reduce((sum, chapter) => sum + chapter.views, 0).toLocaleString()}
            </div>
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
      </div>

      {/* Chapters Table */}
      <Card>
        <CardContent className="p-0">
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
              {filteredChapters.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell>
                    <div className="font-medium">{chapter.title}</div>
                  </TableCell>
                  <TableCell>{chapter.novel.title}</TableCell>
                  <TableCell>#{chapter.order}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${ACCESS_TIER_COLORS[chapter.accessTier as keyof typeof ACCESS_TIER_COLORS]}`} />
                      <span>{chapter.accessTier}</span>
                      {chapter.accessTier !== 'FREE' && <Lock className="h-3 w-3" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={chapter.isPublished ? 'default' : 'secondary'}>
                      {chapter.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{chapter.views.toLocaleString()}</TableCell>
                  <TableCell>{chapter.wordCount.toLocaleString()}</TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {chapter.isPublished ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>
    </div>
  )
}