'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CoinsIcon, Copy, Edit, Eye, MoreHorizontal, Plus, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChapterDeleteButton } from '@/components/chapter/page'

export default function CreateChapterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('novelId')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        novelId: id || '',
        accessTier: 'FREE',
        isPublished: false,
        metaTitle: '',
        metaDescription: '',
        priceCoins: 0,
        isLocked: false
    })

    // Fetch novels for selection
    const { data: res = {} } = useQuery({
        queryKey: ['chapters-list', id],
        queryFn: async () => {
            const response = await api.get(`/admin/novels/${id}`)
            if (response.status !== 200) throw new Error('Failed to fetch chapters')
            return response.data || {}
        }
    })
    

    const handleCopyLink = (novelSlug: string, chapterSlug: string) => {
        const link = `${process.env.NEXT_PUBLIC_APP_URL}/novel/${novelSlug}/chapter/${chapterSlug}`;
        navigator.clipboard.writeText(link).then(() => {
            toast.success("Chpater link has been copied");
        }).catch((error) => {
            console.error("Failed to copy link:", error);
            toast.error("Failed to copy chapter link.");
        });
    };

    return (
        <div className="space-y-4 md:space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h1 className="text-3xl font-bold">Create New Chapter</h1>
                        <p className="text-muted-foreground">Add a new chapter to {res?.novel?.title}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/chapters/create?novelId=${res?.novel?.id}`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add new chapter
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Chapters Table */}
            <Card>
                <CardContent className="p-0">
                    {isSubmitting ? (
                        <div className="p-8 text-center">Loading chapters...</div>
                    ) : res?.chapters?.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No chapters found. <Link href="/admin/chapters/create" className="text-primary hover:underline">Create your first chapter</Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Chapter</TableHead>
                                    <TableHead>Novel</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Words</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {res?.chapters
                                    ?.sort((a: any, b: any) => b.order - a.order)
                                    .map((chapter: any) => (
                                        <TableRow key={chapter.id}>
                                            <TableCell>#{chapter.order}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{chapter.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{chapter.novel.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {chapter.priceCoins > 0 && chapter.isLocked ? <span className='flex items-center gap-1'><CoinsIcon className="w-4 h-4 text-yellow-600" />{chapter.priceCoins}</span> : "FREE"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={chapter.isPublished ? 'default' : 'secondary'}>
                                                    {chapter.isPublished ? 'Published' : 'Draft'}
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
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="gap-1"
                                                                onClick={() => handleCopyLink(res?.novel.slug, chapter?.slug,)}
                                                            >
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Copy Link
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {/* <DropdownMenuItem asChild>
                                                        <Link href={`/novel/${chapter.novel.slug}/chapter/${chapter.slug}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem> */}
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/chapters/${chapter.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {/* <DropdownMenuItem
                                                        onClick={() => handleTogglePublish(chapter.id, chapter.isPublished)}
                                                    >
                                                        {chapter.isPublished ? 'Unpublish' : 'Publish'}
                                                    </DropdownMenuItem> */}
                                                        <ChapterDeleteButton id={chapter.id} />
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
        </div>
    )
}