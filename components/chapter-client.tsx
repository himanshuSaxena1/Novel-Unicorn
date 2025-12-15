"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextRenderer } from "@/components/MarkdownReader";
import { ReaderProvider } from "@/components/reader/reader-provider";
import { ReadingControls } from "@/components/reader/reading-controls";
import { ReaderContainer } from "@/components/reader/reader-container";
import api from "@/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import ChapterComments from "./ChapterComments";
import { Badge } from "./ui/badge";
import NovelCard from "./NovelCard";

export function ChapterClient({ data, trendingNovels }: { data: any; trendingNovels: any }) {
    const router = useRouter();
    const { novel, chapter, prev, next } = data;
    const [locked, setLocked] = useState(chapter.isLocked);
    const [unlocking, setUnlocking] = useState(false);
    const { data: session, update } = useSession()

    const handleUnlock = async () => {
        if (!session) {
            toast.error("Please log in to unlock this chapter.");
            router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
            return;
        }

        try {
            setUnlocking(true);
            const res = await api.post(`/chapters/paypal/${chapter.id}/purchase`);
            if (res.data.success) {
                toast.success("Chapter unlocked! Enjoy reading.");
                window.location.reload()
                if (res.data.unlocked) {
                    setLocked(false);
                    chapter.content = res.data.unlocked.content;
                    await update();
                    return;
                }
                const chapterRes = await api.get(`/novels/${novel.slug}/chapters/${chapter.slug}`);
                if (chapterRes.data.chapter && !chapterRes.data.chapter.isLocked) {
                    setLocked(false);
                    chapter.content = chapterRes.data.chapter.content;
                } else {
                    toast.error("Failed to unlock chapter. Please refresh or contact support.");
                }
            }
        } catch (err: any) {
            if (err.response?.data?.error === "Already purchased") {
                toast.success("You have already purchased this chapter.");
                const chapterRes = await api.get(`/novels/${novel.slug}/chapters/${chapter.slug}`);
                if (chapterRes.data.chapter && !chapterRes.data.chapter.isLocked) {
                    setLocked(false);
                    chapter.content = chapterRes.data.chapter.content;
                } else {
                    toast.error("Chapter is still locked. Please contact support.");
                }
            } else if (err.response?.data?.error === "Insufficient coins") {
                toast.error("You don’t have enough coins. Please recharge first.");
                router.push("");
            } else {
                console.error("Unlock failed", err);
                toast.error("Failed to unlock chapter. Please try again.");
            }
        } finally {
            setUnlocking(false);
        }
    };


    return (
        <ReaderProvider>
            <main className="max-w-5xl min-h-[65vh] mx-auto px-3 md:px-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 md:py-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href={`/novel/${novel.slug}`} className="text-muted-foreground hover:underline">
                            {novel.title}
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">{chapter.title}</span>
                    </div>
                    <div className="hidden gap-2 md:flex">
                        {prev ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/novel/${novel.slug}/chapter/${prev.slug}`}>Previous</Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                        )}
                        {next ? (
                            <Button asChild size="sm">
                                <Link href={`/novel/${novel.slug}/chapter/${next.slug}`}>Next</Link>
                            </Button>
                        ) : (
                            <Button size="sm" disabled>
                                Next
                            </Button>
                        )}
                    </div>
                </div>

                <ReadingControls />

                <ReaderContainer>
                    {!locked && chapter.content ? (
                        <RichTextRenderer content={chapter.content} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-muted/30 rounded-2xl shadow-sm border border-border text-center">
                            <h2 className="text-2xl font-semibold mb-3">🔒 This chapter is locked</h2>
                            <p className="max-w-md text-muted-foreground mb-6">
                                Support the <span className="font-medium text-foreground">translator and author </span>
                                by unlocking this premium chapter. Your contribution helps us keep stories coming!
                            </p>

                            <Button
                                onClick={handleUnlock}
                                className="px-8 py-3 text-base font-medium transition-all hover:scale-[1.03]"
                            >
                                {unlocking ? "Unlocking..." : `Unlock for ${chapter.priceCoins || 50} Coins`}
                            </Button>

                            {!session && (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    <button
                                        onClick={() => router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname))}
                                        className="text-primary font-medium hover:underline"
                                    >
                                        Log in
                                    </button>
                                    {" "}to unlock and support creators.
                                </p>
                            )}

                            <p className="mt-3 text-xs text-muted-foreground">
                                Don’t have enough coins?{" "}
                                <button
                                    onClick={() => router.push("/coins")}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Get more here
                                </button>.
                            </p>
                        </div>
                    )}
                </ReaderContainer>

                <div className="flex items-center justify-between pb-5 md:hidden">
                    {prev ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/novel/${novel.slug}/chapter/${prev.slug}`}>Previous</Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                    )}
                    {next ? (
                        <Button asChild size="sm">
                            <Link href={`/novel/${novel.slug}/chapter/${next.slug}`}>Next</Link>
                        </Button>
                    ) : (
                        <Button size="sm" disabled>
                            Next
                        </Button>
                    )}
                </div>

                <ChapterComments chapterId={chapter.id} />
                <div className="py-4">
                    <h2 className="text-base md:text-2xl font-bold mb-6">Trending Novels</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
                        {trendingNovels.slice(0, 5).map((novel: any, index: number) => (
                            <div key={novel.id} className="relative">
                                <Badge className="absolute -top-2 -left-2 z-10 bg-green-500 text-white">
                                    #{index + 1}
                                </Badge>
                                <NovelCard {...novel} showDetails={false} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </ReaderProvider>
    );
}