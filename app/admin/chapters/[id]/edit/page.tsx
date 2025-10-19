'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import CursorResizableEditor from '@/components/TiptapEditor'
import api from '@/lib/axios'

export default function UpdateChapterPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const chapterId = params.id

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        novelId: '',
        accessTier: 'FREE',
        isPublished: false,
        metaTitle: '',
        metaDescription: '',
        priceCoins: 0,
        isLocked: false,
    })

    // Fetch chapter data using useEffect
    useEffect(() => {
        const fetchChapter = async () => {
            if (!chapterId) {
                toast.error('Chapter ID is missing. Redirecting to chapters list.')
                router.push('/admin/chapters')
                setLoading(false)
                return
            }

            try {
                const response = await api.get(`/chapters/${chapterId}`) // Corrected endpoint
                if (response.status !== 200) throw new Error('Failed to fetch chapter')
                const data = response.data
                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    content: data.content || '',
                    novelId: data.novelId || '',
                    accessTier: data.accessTier || 'FREE',
                    isPublished: data.isPublished || false,
                    metaTitle: data.metaTitle || '',
                    metaDescription: data.metaDescription || '',
                    priceCoins: data.priceCoins || 0,
                    isLocked: data.isLocked || false,
                })
            } catch (err: any) {
                console.error('Error fetching chapter:', err)
                toast.error(err.message || 'Failed to load chapter')
                router.push('/admin/chapters') // Redirect on error
            } finally {
                setLoading(false)
            }
        }

        fetchChapter()
    }, [chapterId, router])

    // Fetch novels for selection (optional, can be removed if not needed)
    const { data: novels = [] } = useQuery({
        queryKey: ['novels-list'],
        queryFn: async () => {
            const response = await api.get('/novels?limit=100')
            if (response.status !== 200) throw new Error('Failed to fetch novels')
            const data = response.data
            return data.novels || []
        }
    })

    // Mutation for updating chapter
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.patch(`/admin/chapters/${chapterId}`, {
                ...data,
                wordCount: data.content.split(/\s+/).length,
            })
            if (response.status !== 200) {
                throw new Error('Failed to update chapter')
            }
            setIsSubmitting(true)
            return response.data
        },
        onSuccess: () => {
            toast.success('Chapter updated successfully!')
            router.back()
        },
        onError: (error: any) => {
            setIsSubmitting(true)
            toast.error(error.response.data.error || 'Failed to update chapter')
        },
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Auto-generate slug from title
        if (field === 'title') {
            setFormData((prev) => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.novelId) {
            toast.error('Please select a novel')
            return
        }

        setIsSubmitting(true)
        mutation.mutate(formData)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
                Loading novel data...
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/chapters">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Chapters
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Update Chapter</h1>
                        <p className="text-muted-foreground">Edit the chapter details</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid ">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="novel">Novel *</Label>
                                <Select
                                    value={formData.novelId}
                                    onValueChange={(value) => handleInputChange('novelId', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a novel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {novels.map((novel: any) => (
                                            <SelectItem key={novel.id} value={novel.id}>
                                                {novel.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Chapter Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., Chapter 1: The Beginning"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    placeholder="chapter-slug"
                                    required
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground">
                                    Auto-generated from title. Used in URL
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="locked"
                                    checked={formData.isLocked}
                                    onCheckedChange={(checked) => handleInputChange('isLocked', checked)}
                                />
                                <Label htmlFor="locked">Lock Chapter</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priceCoins">Chapter Price</Label>
                                <Input
                                    id="priceCoins"
                                    type="number"
                                    min={0}
                                    value={formData.priceCoins}
                                    onChange={(e) => handleInputChange('priceCoins', parseInt(e.target.value, 10) || 0)}
                                    placeholder="Price in coins (0 for free)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Set to 0 for free chapters. Users will need enough coins to access paid chapters.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="published"
                                    checked={formData.isPublished}
                                    onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                                />
                                <Label htmlFor="published">Publish immediately</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO Settings */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                                    placeholder="SEO title for this chapter"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                                    placeholder="Brief description for search engines"
                                    className="min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Chapter Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chapter Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <CursorResizableEditor
                                value={formData.content}
                                onChange={(value) => handleInputChange('content', value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Word count: {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/chapters">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting || mutation.isPending ? 'Updating...' : 'Update Chapter'}
                    </Button>
                </div>
            </form>
        </div>
    )
}