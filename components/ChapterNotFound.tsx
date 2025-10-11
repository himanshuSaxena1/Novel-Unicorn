"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertTriangle } from "lucide-react";

export function ChapterNotFound() {
    const router = useRouter();

    return (
        <main className="flex flex-col items-center justify-center text-center py-24 px-6">
            <div className="flex flex-col items-center gap-4 bg-muted/40 p-10 rounded-2xl shadow-sm border border-border max-w-md">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <h1 className="text-2xl font-semibold">Chapter Missing or Removed</h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                    The chapter you’re looking for is currently unavailable.
                    <br />
                    It may have been <span className="text-foreground font-medium">removed due to DMCA</span>,
                    or the link may be broken.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center mx-auto gap-3 mt-6 w-full">
                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => router.back()}
                        variant="outline"
                    >
                        Go Back
                    </Button>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => router.push("/")}
                    >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Browse Novels
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
                If you believe this is a mistake, please{" "}
                <a
                    href="/support"
                    className="text-primary hover:underline font-medium"
                >
                    contact support
                </a>
                .
            </p>
        </main>
    );
}
