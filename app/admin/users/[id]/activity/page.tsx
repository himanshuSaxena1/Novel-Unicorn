"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"


interface ReadingActivity {
    id: string
    progress: number
    createdAt: string
    updatedAt: string
    chapter: {
        id: string
        title: string
        slug: string
        order: number
        novel: {
            id: string
            title: string
            slug: string
        }
    }
}

export default function UserActivityPage() {
    const router = useRouter()
    const { id } = useParams()
    const queryClient = useQueryClient()



    // ---------------- Activity ----------------

    const { data: activity, isLoading: activityLoading } = useQuery<ReadingActivity[]>({
        queryKey: ["user-activity", id],
        queryFn: async () => {
            const res = await api.get(`/admin/users/${id}/activity`)
            return res.data
        },
        enabled: !!id,
    })


    if (activityLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
                Loading user&apos;s activity...
            </div>
        )
    }

    return (
        <div className=" container mx-auto p-1 md:p-4 space-y-10">

            {/* ---------------- User Activity ---------------- */}

            <div>
                <h2 className="text-xl font-semibold mb-4">Reading Activity</h2>

                {activityLoading && (
                    <p className="text-muted-foreground">Loading activity...</p>
                )}

                {!activityLoading && activity?.length === 0 && (
                    <p className="text-muted-foreground">No reading activity yet.</p>
                )}

                <div className="space-y-4">
                    {activity?.map(item => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 bg-secondary space-y-2"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">
                                        📖 {item.chapter.novel.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Chapter: {item.chapter.title}
                                    </p>
                                </div>

                                <span className="text-xs text-muted-foreground">
                                    Last read: {new Date(item.updatedAt).toLocaleString()}
                                </span>
                            </div>

                            <Progress value={item.progress} className="h-2 w-full" />

                            <div className="text-sm flex justify-between text-muted-foreground">
                                <span>{item.progress}% complete</span>
                                <span>
                                    Started: {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Debug/admin clarity */}
                            <div className="text-xs opacity-60">
                                <Link href={`/novel/${item.chapter?.novel?.slug}`} target="__blank" className="underline">
                                    Novel: {item.chapter.novel.title}
                                </Link> <br />
                                Chapter ID: {item.chapter.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}