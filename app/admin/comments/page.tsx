"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/axios"
import { formatDistanceToNow } from "date-fns"

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [expanded, setExpanded] = useState<string | null>(null)

    useEffect(() => {
        loadComments()
    }, [])

    async function loadComments() {
        try {
            setLoading(true)
            const { data } = await api.get("/admin/comments")
            setComments(data)
            setFiltered(data)
        } catch (err: any) {
            console.error(err)
            setError("Failed to load comments")
        } finally {
            setLoading(false)
        }
    }

    function applySearch(value: string) {
        setSearch(value)
        const term = value.toLowerCase()
        setFiltered(
            comments.filter((c) =>
                [
                    c.author.username,
                    c.chapter.title,
                    c.chapter.novel.title,
                    c.content,
                ].some((f) => f.toLowerCase().includes(term))
            )
        )
    }

    async function deleteComment(id: string) {
        if (!confirm("Are you sure you want to delete this comment?")) return

        try {
            await api.delete(`/admin/comments/${id}`)
            setComments((prev) => prev.filter((c) => c.id !== id))
            setFiltered((prev) => prev.filter((c) => c.id !== id))
        } catch (err) {
            console.error(err)
            alert("Failed to delete comment")
        }
    }

    if (loading)
        return (
            <div className="p-10 text-center text-lg text-gray-600">
                Loading comments...
            </div>
        )

    if (error)
        return (
            <div className="p-10 text-center text-red-500">
                {error}
            </div>
        )

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Comments Management</h1>

            {/* Search Bar */}
            <input
                value={search}
                onChange={(e) => applySearch(e.target.value)}
                placeholder="Search by username, novel, chapter, content..."
                className="w-full p-3 border rounded-lg  shadow-sm"
            />

            {/* Comments List */}
            <div className="space-y-4">
                {filtered.map((c) => (
                    <div
                        key={c.id}
                        className="border rounded-lg shadow-sm p-5"
                    >
                        <div className="flex justify-between items-start gap-3">
                            <div>
                                <div className="flex gap-2 items-center">
                                    <span className="font-semibold text-blue-600">
                                        {c.author.username}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        • {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                                    </span>
                                </div>

                                <div className="mt-1 text-sm text-gray-500">
                                    <strong>{c.chapter.novel.title}</strong> /
                                    <span className="text-gray-600"> {c.chapter.title}</span>
                                </div>

                                {/* Content */}
                                <div className="mt-3 dark:text-white whitespace-pre-line">
                                    {expanded === c.id ? c.content : c.content.slice(0, 200)}
                                    {c.content.length > 200 && (
                                        <button
                                            onClick={() =>
                                                setExpanded(expanded === c.id ? null : c.id)
                                            }
                                            className="text-blue-600 ml-2 text-sm hover:underline"
                                        >
                                            {expanded === c.id ? "Show less" : "Read more"}
                                        </button>
                                    )}
                                </div>

                                {/* Replies */}
                                {c.replies.length > 0 && (
                                    <div className="mt-4 bg-gray-50 p-3 rounded border">
                                        <div className="text-sm font-semibold mb-2 text-gray-700">
                                            Replies ({c.replies.length})
                                        </div>

                                        <div className="space-y-2">
                                            {c.replies.map((r: any) => (
                                                <div key={r.id} className="text-sm text-gray-700">
                                                    <strong className="text-blue-500">{r.author.username}</strong>:
                                                    <span className="ml-1">{r.content}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => deleteComment(c.id)}
                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        No comments found.
                    </div>
                )}
            </div>
        </div>
    )
}
