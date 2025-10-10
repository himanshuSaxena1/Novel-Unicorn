import { BookX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NovelNotFound({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-8",
                className
            )}
        >
            <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-500/10 via-rose-400/10 to-purple-500/10 blur-xl" />
                <BookX className="w-12 md:w-20 h-12 md:h-20 text-muted-foreground relative z-10" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Novel Not Found
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn’t find the novel you’re looking for. It may have been
                    removed due to DMCA, unpublished, or the link is incorrect.
                </p>
            </div>

            <div className="flex gap-3">
                <Link href="/browse">
                    <Button variant="default">Browse Novels</Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
            </div>
        </div>
    );
}
