'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Save, ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const GENRE_OPTIONS = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller', 'Horror',
  'Adventure', 'Drama', 'Comedy', 'Action', 'Cultivation', 'System',
  'Reincarnation', 'Magic', 'School', 'Martial Arts', 'Gaming', 'VR'
]

const TAG_OPTIONS = [
  'Strong Protagonist', 'Weak to Strong', 'Multiple POV', 'First Person',
  'Male Lead', 'Female Lead', 'Overpowered', 'Underdog', 'Revenge',
  'Kingdom Building', 'Academy', 'Transported', 'Modern Day', 'Medieval',
  'Futuristic', 'Dragons', 'Demons', 'Gods', 'Magic Academy', 'Tournaments'
]

export default function EditNovelPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    cover: '',
    status: 'ONGOING',
    genres: [] as string[],
    tags: [] as string[],
    isPublished: false,
    isFeatured: false,
    language: 'ENGLISH',
    novelPrice: null as number | null,
  })

  // Fetch novel data
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const res = await fetch(`/api/novels/${slug}`)
        if (!res.ok) throw new Error('Novel not found')
        const data = await res.json()
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          cover: data.cover || '',
          status: data.status || 'ONGOING',
          genres: data.genres || [],
          tags: data.tags || [],
          isPublished: data.isPublished || false,
          isFeatured: data.isFeatured || false,
          language: data.language || 'ENGLISH',
          novelPrice: data.novelPrice || null,
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to load novel')
        router.push('/admin/novels')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchNovel()
  }, [slug, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = (field: 'genres' | 'tags', item: string) => {
    if (!formData[field].includes(item)) {
      handleInputChange(field, [...formData[field], item])
    }
  }

  const removeItem = (field: 'genres' | 'tags', item: string) => {
    handleInputChange(field, formData[field].filter(i => i !== item))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.patch(`/novels/${slug}`, {
        headers: { 'Content-Type': 'application/json' },
        data: formData,
      })

      if (response.status !== 200) throw new Error('Failed to update novel')
      if (response) {
        toast.success('Novel updated successfully')
      }
      router.push('/admin/novels')
    } catch (err) {
      console.error(err)
      toast.error('Error updating novel')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading novel data...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/novels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Novels
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Novel</h1>
            <p className="text-muted-foreground">Modify and update your novel details</p>
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
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={formData.slug} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="HIATUS">Hiatus</SelectItem>
                    <SelectItem value="DROPPED">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {
                formData.status === 'COMPLETED' && (
                  <div className="space-y-2">
                    <Label htmlFor="novelPrice">Novel Price</Label>
                    <Input
                      type="number"
                      id="novelPrice"
                      value={formData.novelPrice || 0}
                      onChange={(e) => handleInputChange('novelPrice', e.target.value)}
                      placeholder="Enter novel price"
                    />
                  </div>
                )
              }
            </CardContent>
          </Card>



          {/* Cover Image */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input
                id="cover"
                value={formData.cover}
                onChange={(e) => handleInputChange('cover', e.target.value)}
                placeholder="https://example.com/cover.jpg"
              />

              {formData.cover && (
                <div className="aspect-[3/4] w-48 mx-auto">
                  <Image
                    src={formData.cover}
                    alt="Cover"
                    width={300}
                    height={400}
                    className="rounded-md border object-cover w-full h-full"
                  />
                </div>
              )}
            </CardContent>
          </Card> */}
          {/* Cover Image */}

          <div className='flex flex-col gap-3'>
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={formData.cover}
                  onChange={(e) => handleInputChange('cover', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />

                {formData.cover && (
                  <div className="aspect-[3/4] w-48 mx-auto relative">
                    <Image
                      src={formData.cover}
                      alt="Cover"
                      width={300}
                      height={400}
                      className="rounded-md border object-cover w-full h-full"
                    />
                  </div>
                )}

                {/* Upload Image Section */}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="upload-file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        toast.loading('Uploading image...');
                        setIsSubmitting(true);

                        const { uploadImage } = await import('@/lib/upload-image');
                        const url = await uploadImage(file, (progress) => {
                          toast.loading(`Uploading: ${progress}%`);
                        });

                        handleInputChange('cover', url);
                        toast.success('Image uploaded successfully!');
                      } catch (err: any) {
                        console.error(err);
                        toast.error(err.message || 'Image upload failed');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('upload-file')?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Uploading...' : 'Upload New Cover'}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Recommended size: 300x400px (3:4 ratio)
                </p>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Label htmlFor="feature">Select Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENGLISH">ENGLISH</SelectItem>
                  <SelectItem value="JAPANESE">JAPANESE</SelectItem>
                  <SelectItem value="CHINESE">CHINESE</SelectItem>
                  <SelectItem value="KOREAN">KOREAN</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Featuring</Label>
              <Select
                value={formData.isFeatured ? 'YES' : 'NO'}
                onValueChange={(v) => handleInputChange('isFeatured', v === 'YES')}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">YES</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Publish</Label>
              <Select
                value={formData.isPublished ? 'YES' : 'NO'}
                onValueChange={(v) => handleInputChange('isPublished', v === 'YES')}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">YES</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        {/* Genres */}
        <Card>
          <CardHeader><CardTitle>Genres</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map(genre => (
                <Button
                  key={genre}
                  type="button"
                  size="sm"
                  variant={formData.genres.includes(genre) ? "default" : "outline"}
                  onClick={() =>
                    formData.genres.includes(genre)
                      ? removeItem('genres', genre)
                      : addItem('genres', genre)
                  }
                >
                  {formData.genres.includes(genre) && <X className="mr-1 h-3 w-3" />}
                  {genre}
                </Button>
              ))}
            </div>
            {formData.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.genres.map(g => (
                  <Badge key={g} className="flex items-center">
                    {g}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeItem('genres', g)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  onClick={() =>
                    formData.tags.includes(tag)
                      ? removeItem('tags', tag)
                      : addItem('tags', tag)
                  }
                >
                  {formData.tags.includes(tag) && <X className="mr-1 h-3 w-3" />}
                  {tag}
                </Button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(t => (
                  <Badge key={t} variant="secondary" className="flex items-center">
                    {t}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeItem('tags', t)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/novels">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
