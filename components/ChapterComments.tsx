// components/ChapterComments.tsx
"use client";

import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { commentApi, type Comment } from "@/lib/api/comment";

interface Props {
    chapterId: string;
}

export default function ChapterComments({ chapterId }: Props) {
    const { data: session } = useSession();
    const [newComment, setNewComment] = useState("");
    const [posting, setPosting] = useState(false);

    // SWR for top-level comments
    const {
        data: comments = [],
        mutate: mutateTop,
        isLoading,
    } = useSWR<Comment[]>(`/chapters/${chapterId}/comments`, async () => {
        const res = await commentApi.getChapterComments(chapterId);
        return res.data;
    });

    const postComment = async () => {
        if (!newComment.trim() || !session) return;
        setPosting(true);
        try {
            const res = await commentApi.createComment(chapterId, newComment);
            mutateTop([res.data, ...comments], false); // optimistic update
            setNewComment("");
        } finally {
            setPosting(false);
        }
    };

    return (
        <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

            {/* New comment form */}
            {session ? (
                <div className="mb-10 flex gap-2 items-start">
                    <Avatar className="w-6 h-6 md:w-8 md:h-8 shrink-0">
                        <AvatarImage src={session.user?.image ?? undefined} />
                        <AvatarFallback className="text-sm md:text-base capitalize">{session.user?.username?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                            className="mb-2"
                        />
                        <Button onClick={postComment} disabled={posting || !newComment.trim()}>
                            {posting ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-muted-foreground mb-5">Sign in to leave a comment.</p>
            )}

            {/* Comments list */}
            <div className="space-y-8">
                {isLoading ? (
                    <>
                        <CommentSkeleton />
                        <CommentSkeleton />
                    </>
                ) : comments.length === 0 ? (
                    <p className="text-center text-muted-foreground pb-6">
                        No comments yet. Be the first!
                    </p>
                ) : (
                    comments.map((c) => (
                        <CommentThread
                            key={c.id}
                            comment={c}
                            chapterId={chapterId}
                            depth={0}
                            onCommentDeleted={(id) =>
                                mutateTop(comments.filter((x) => x.id !== id), false)
                            }
                        />
                    ))
                )}
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                              COMMENT THREAD                                */
/* -------------------------------------------------------------------------- */
interface ThreadProps {
    comment: Comment;
    chapterId: string;
    depth: number;
    onCommentDeleted: (id: string) => void;
}

function CommentThread({
    comment,
    chapterId,
    depth,
    onCommentDeleted,
}: ThreadProps) {
    const { data: session } = useSession();
    const isAuthor = session?.user?.id === comment.author.id;
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [postingReply, setPostingReply] = useState(false);

    // SWR for replies (lazy load)
    const { data: replies = [], mutate: mutateReplies } = useSWR<Comment[]>(
        showReplies ? `/chapters/${chapterId}/comments/${comment.id}/replies` : null,
        async () => {
            const res = await commentApi.getReplies(chapterId, comment.id);
            return res.data;
        }
    );

    const deleteComment = async () => {
        if (!confirm("Delete this comment?")) return;
        await commentApi.deleteComment(chapterId, comment.id);
        onCommentDeleted(comment.id);
    };

    const postReply = async () => {
        if (!replyText.trim()) return;
        setPostingReply(true);
        try {
            const res = await commentApi.createReply(chapterId, comment.id, replyText);
            mutateReplies([res.data, ...replies], false);
            setReplyText("");
            // Update parent count optimistically
            mutate(
                `/chapters/${chapterId}/comments`,
                (data: Comment[] = []) =>
                    data.map((c) =>
                        c.id === comment.id
                            ? { ...c, _count: { replies: (c._count?.replies || 0) + 1 } }
                            : c
                    ),
                false
            );
        } finally {
            setPostingReply(false);
        }
    };

    return (
        <div className={`${depth > 0 ? "ml-8 border-l-2 pl-6" : ""}`}>
            {/* Comment */}
            <div className="flex gap-3 mb-4">
                <Avatar className="w-6 h-6 md:w-8 md:h-8 shrink-0">
                    <AvatarImage src={comment.author.avatar ?? undefined} />
                    <AvatarFallback className="text-sm md:text-base capitalize">{comment.author.username[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{comment.author.username}</span>
                        <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                        {isAuthor && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={deleteComment}
                                className="h-7 w-7"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    <p className="mt-1 text-foreground whitespace-pre-wrap">
                        {comment.content}
                    </p>

                    <div className="mt-2 flex items-center gap-4 text-sm">
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="flex items-center gap-1 text-primary hover:underline"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Reply
                        </button>

                        {comment._count?.replies ? (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center gap-1 text-muted-foreground hover:underline"
                            >
                                {showReplies ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                                {comment._count.replies} {comment._count.replies === 1 ? "reply" : "replies"}
                            </button>
                        ) : null}
                    </div>

                    {/* Reply Form */}
                    {showReplies && (
                        <div className="mt-4 flex gap-3 items-start">
                            <Avatar className="w-8 h-8 shrink-0">
                                <AvatarImage src={session?.user?.image ?? undefined} />
                                <AvatarFallback>{session?.user?.username?.[0] ?? "U"}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <Textarea
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={2}
                                    className="mb-2"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={postReply}
                                        disabled={postingReply || !replyText.trim()}
                                    >
                                        {postingReply ? "Posting..." : "Post Reply"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setReplyText("");
                                            setShowReplies(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Render replies */}
                    {showReplies && replies.length > 0 && (
                        <div className="mt-6 space-y-6">
                            {replies.map((r) => (
                                <CommentThread
                                    key={r.id}
                                    comment={r}
                                    chapterId={chapterId}
                                    depth={depth + 1}
                                    onCommentDeleted={async (id) => {
                                        mutateReplies(replies.filter((x) => x.id !== id), false);
                                        // update parent count
                                        mutate(
                                            `/chapters/${chapterId}/comments`,
                                            (data: Comment[] = []) =>
                                                data.map((c) =>
                                                    c.id === comment.id
                                                        ? { ...c, _count: { replies: (c._count?.replies || 1) - 1 } }
                                                        : c
                                                ),
                                            false
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 SKELETON                                   */
/* -------------------------------------------------------------------------- */
function CommentSkeleton() {
    return (
        <div className="flex gap-3 animate-pulse">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    );
}