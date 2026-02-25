"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { calculateStreak } from "@/lib/utils"


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
    const heatmap: Record<string, number> = {}


    // ---------------- Activity ----------------

    const { data: activity, isLoading: activityLoading } = useQuery<ReadingActivity[]>({
        queryKey: ["user-activity", id],
        queryFn: async () => {
            const res = await api.get(`/admin/users/${id}/activity`)
            return res.data
        },
        enabled: !!id,
    })

    const activityDates = activity?.map(a => a.updatedAt) || []
    const streak = calculateStreak(activityDates)

    activity?.forEach(a => {
        const day = new Date(a.updatedAt).toDateString()
        heatmap[day] = (heatmap[day] || 0) + 1
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

                <div className="flex gap-6 mb-6">
                    <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Current streak</p>
                        <p className="text-2xl font-bold">🔥 {streak} days</p>
                    </div>

                    <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Total sessions</p>
                        <p className="text-2xl font-bold">{activity?.length || 0}</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="font-semibold mb-2">Reading activity (last 30 days)</h3>

                    <div className="mb-10">
                        <h3 className="font-semibold mb-4">Reading Activity (Last 8 Weeks)</h3>

                        <div className="flex gap-1">
                            {Array.from({ length: 8 }).map((_, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-1">
                                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                                        const date = new Date()
                                        date.setDate(date.getDate() - (weekIndex * 7 + dayIndex))

                                        const key = date.toDateString()
                                        const count = heatmap[key] || 0

                                        const intensity =
                                            count === 0
                                                ? "bg-muted"
                                                : count < 2
                                                    ? "bg-emerald-300"
                                                    : count < 4
                                                        ? "bg-emerald-500"
                                                        : "bg-emerald-700"

                                        return (
                                            <div
                                                key={key}
                                                title={`${key}: ${count} sessions`}
                                                className={`w-4 h-4 rounded-sm transition-colors ${intensity}`}
                                            />
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="w-4 h-4 bg-muted rounded-sm" />
                            <div className="w-4 h-4 bg-emerald-300 rounded-sm" />
                            <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
                            <div className="w-4 h-4 bg-emerald-700 rounded-sm" />
                            <span>More</span>
                        </div>
                    </div>
                </div>

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

                            <div className="w-full h-2 bg-muted rounded overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                                />
                            </div>

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