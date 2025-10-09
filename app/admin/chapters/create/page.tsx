'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
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

export default function CreateChapterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedNovelId = searchParams.get('novelId')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        novelId: preselectedNovelId || '',
        accessTier: 'FREE',
        isPublished: false,
        metaTitle: '',
        metaDescription: ''
    })

    // Fetch novels for selection
    const { data: novels = [] } = useQuery({
        queryKey: ['novels-list'],
        queryFn: async () => {
            const response = await fetch('/api/novels?limit=100')
            if (!response.ok) throw new Error('Failed to fetch novels')
            const data = await response.json()
            return data.novels || []
        }
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Auto-generate slug from title
        if (field === 'title') {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

        try {
            const response = await fetch('/api/chapters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    wordCount: formData.content.split(/\s+/).length
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create chapter')
            }

            const chapter = await response.json()
            toast.success('Chapter created successfully!')
            router.push('/admin/chapters')
        } catch (error: any) {
            toast.error(error.message || 'Failed to create chapter')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
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
                        <h1 className="text-3xl font-bold">Create New Chapter</h1>
                        <p className="text-muted-foreground">Add a new chapter to a novel</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
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

                            <div className="space-y-2">
                                <Label htmlFor="accessTier">Access Tier</Label>
                                <Select
                                    value={formData.accessTier}
                                    onValueChange={(value) => handleInputChange('accessTier', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FREE">Free</SelectItem>
                                        <SelectItem value="SMALL">Small Tier</SelectItem>
                                        <SelectItem value="MEDIUM">Medium Tier</SelectItem>
                                        <SelectItem value="PREMIUM">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
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
                    <Card>
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
                    </Card>
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
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Creating...' : 'Create Chapter'}
                    </Button>
                </div>
            </form>
        </div>
    )
}