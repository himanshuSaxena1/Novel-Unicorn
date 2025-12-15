'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import api from '@/lib/axios'
import { useSession } from 'next-auth/react'


type Review = {
    id: string
    rating: number
    comment: string | null
    user: { username: string, id: string }
    createdAt: string
}

export default function Reviews({ novelId, slug, userId }: { novelId: string, slug: string, userId?: string }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const queryClient = useQueryClient()
    const { data: session, status } = useSession()

    // Fetch reviews
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['reviews', novelId],
        queryFn: async () => {
            const response = await api.get(`/novels/${slug}/reviews`)
            if (response.status !== 200) throw new Error('Failed to fetch reviews')
            return response.data.reviews
        }
    })

    // Submit review
    const submitReview = useMutation({
        mutationFn: async () => {
            if (!userId) throw new Error('You must be logged in to submit a review')
            const response = await api.post('/reviews', {
                novelId,
                rating,
                comment: comment.trim() || null
            })
            if (response.status !== 200) throw new Error('Failed to submit review')
            return response.data
        },
        onSuccess: () => {
            toast.success('Review submitted successfully')
            setRating(0)
            setComment('')
            queryClient.invalidateQueries({ queryKey: ['reviews', novelId] })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to submit review')
        }
    })

    // Delete review
    const deleteReview = useMutation({
        mutationFn: async (reviewId: string) => {
            const response = await api.delete(`/reviews/${reviewId}`)
            if (response.status !== 200) throw new Error('Failed to delete review')
            return response.data
        },
        onSuccess: () => {
            toast.success('Review deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['reviews', novelId] })
        },
        onError: () => {
            toast.error('Failed to delete review')
        }
    })

    return (
        <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <Card>
                <CardContent className="p-2 md:p-6 space-y-6">
                    {/* Review Form */}
                    {userId ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Write a Review</h3>
                            <div className="space-y-2">
                                <Label>Rating</Label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                }`}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Comment (optional)</Label>
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your thoughts about this novel..."
                                    className="min-h-[100px]"
                                />
                            </div>
                            <Button
                                onClick={() => submitReview.mutate()}
                                disabled={submitReview.isPending || rating === 0}
                            >
                                {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Please <a href="/login" className="text-primary hover:underline">log in</a> to write a review.
                        </p>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <p className="text-center text-muted-foreground">Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                            <p className="text-center text-muted-foreground">No reviews yet.</p>
                        ) : (
                            reviews.map((review: Review) => (
                                <div key={review.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{review.user.username}</span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {(userId === review.user.id || session?.user?.role === 'ADMIN') && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteReview.mutate(review.id)}
                                                disabled={deleteReview.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {review.comment && (
                                        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}