'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { X, Plus, Upload, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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

export default function CreateNovelPage() {
  const router = useRouter()
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
    isFeaturing: false,
    language: 'ENGLISH',
    novelPrice: null as number | null,
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
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create novel')
      }

      const novel = await response.json()
      console.log('Novel created:', novel)

      router.push('/admin/novels')
    } catch (error) {
      console.error('Error creating novel:', error)
      // You might want to show a toast notification here
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
            <Link href="/admin/novels">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Novels
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Novel</h1>
            <p className="text-muted-foreground">Add a new novel to your platform</p>
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
                  placeholder="Enter novel title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="novel-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated from title. Used in URL: /novel/{formData.slug}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the novel..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={formData.cover}
                  onChange={(e) => handleInputChange('cover', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              {formData.cover && (
                <div className="aspect-[3/4] w-48 mx-auto">
                  <Image
                    width={300}
                    height={400}
                    src={formData.cover}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                </div>
              )}

              <Button type="button" variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Cover Image
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Recommended size: 300x400px (3:4 ratio)
              </p>
            </CardContent>
          </Card> */}

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
              <Label htmlFor="feature">Featuring</Label>
              <Select
                value={formData.isFeaturing ? 'YES' : 'NO'}
                onValueChange={(value) => handleInputChange('isFeaturing', value === 'YES')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">YES</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>



            <div className="space-y-2">
              <Label htmlFor="isPublished">Publish</Label>
              <Select
                value={formData.isPublished ? 'YES' : 'NO'}
                onValueChange={(value) => handleInputChange('isPublished', value === 'YES')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
          <CardHeader>
            <CardTitle>Genres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Genres (max 5)</Label>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((genre) => (
                  <Button
                    key={genre}
                    type="button"
                    variant={formData.genres.includes(genre) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      formData.genres.includes(genre)
                        ? removeItem('genres', genre)
                        : formData.genres.length < 5 && addItem('genres', genre)
                    }
                    disabled={!formData.genres.includes(genre) && formData.genres.length >= 5}
                  >
                    {formData.genres.includes(genre) && <X className="mr-1 h-3 w-3" />}
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            {formData.genres.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Genres:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre) => (
                    <Badge key={genre} variant="default" className="flex items-center space-x-1">
                      <span>{genre}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeItem('genres', genre)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Tags (max 10)</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      formData.tags.includes(tag)
                        ? removeItem('tags', tag)
                        : formData.tags.length < 10 && addItem('tags', tag)
                    }
                    disabled={!formData.tags.includes(tag) && formData.tags.length >= 10}
                  >
                    {formData.tags.includes(tag) && <X className="mr-1 h-3 w-3" />}
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {formData.tags.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Tags:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeItem('tags', tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/novels">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Creating...' : 'Create Novel'}
          </Button>
        </div>
      </form>
    </div>
  )
}