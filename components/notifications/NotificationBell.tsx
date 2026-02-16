"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import api from "@/lib/axios";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatTimeAgo } from "@/lib/utils";

type NotificationItem = {
    id: string;
    type: string;
    title: string;
    body: string | null;
    url: string | null;
    isRead: boolean;
    createdAt: string;
};

type ApiResponse = {
    items: NotificationItem[];
    nextCursor: string | null;
    unreadCount: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function NotificationContent({
    items,
    isLoading,
    markRead,
    markAllRead,
}: {
    items: NotificationItem[];
    isLoading: boolean;
    markRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
}) {
    if (isLoading) {
        return <div className="p-6 text-center text-muted-foreground">Loading notifications...</div>;
    }

    if (!items.length) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                <Bell className="mx-auto h-10 w-10 opacity-40 mb-3" />
                <p>No notifications yet</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between px-5 py-3 border-b">
                <span className="text-sm font-medium text-muted-foreground">
                    {items.filter((n) => !n.isRead).length} unread
                </span>
                <Button variant="ghost" size="sm" onClick={markAllRead} className="h-8 text-xs">
                    Mark all read
                </Button>
            </div>

            <ScrollArea className="md:h-[min(60vh,380px)]">
                {items.map((n) => (
                    <div
                        key={n.id}
                        className={cn(
                            "group relative border-b last:border-b-0 px-5 py-2 transition-colors hover:bg-muted/50",
                            !n.isRead && "bg-muted/30",
                            n.isRead && "opacity-80"
                        )}
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                                <p className="font-medium leading-tight">{n.title}</p>
                                <div className="flex items-center justify-between gap-4">
                                    {n.body && (
                                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-1">
                                            {n.body}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-muted-foreground/80 w-max whitespace-nowrap">
                                        {formatTimeAgo(new Date(n.createdAt))}
                                    </p>
                                </div>
                            </div>

                            {!n.isRead && (
                                <div className="flex-shrink-0 pt-1">
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                </div>
                            )}
                        </div>

                        <div className="mt-3 flex gap-5 text-xs">
                            {n.url && (
                                <a
                                    href={n.url}
                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </a>
                            )}
                            {!n.isRead && (
                                <button
                                    onClick={() => markRead(n.id)}
                                    className="text-muted-foreground hover:text-foreground hover:underline"
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </>
    );
}

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();

    const { data, mutate, isLoading } = useSWR<ApiResponse>(
        session ? "/api/notifications?limit=10" : null,
        fetcher
    );

    useNotificationsSocket({ userId: session?.user?.id, onNotification: mutate });

    const unread = data?.unreadCount ?? 0;
    const items = data?.items ?? [];
    const hasUnread = unread > 0;

    async function markRead(id: string) {
        try {
            await api(`/notifications/${id}/read`, { method: "POST" });
            mutate();
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    }

    async function markAllRead() {
        try {
            await api("/notifications/read-all", { method: "POST" });
            mutate();
        } catch (err) {
            console.error("Failed to mark all read", err);
        }
    }

    const content = useMemo(
        () => (
            <NotificationContent
                items={items}
                isLoading={isLoading}
                markRead={markRead}
                markAllRead={markAllRead}
            />
        ),
        [isLoading, items]
    );

    // Very simple mobile check – you can also use useMediaQuery from shadcn
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const trigger = (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
        >
            <Bell className="h-5 w-5" />
            {hasUnread && (
                <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1.5 text-[10px] font-bold flex items-center justify-center"
                >
                    {unread > 99 ? "99+" : unread}
                </Badge>
            )}
        </Button>
    );

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>{trigger}</SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
                    <SheetHeader className="px-5 py-4 border-b">
                        <SheetTitle>Notifications</SheetTitle>
                    </SheetHeader>
                    {content}
                </SheetContent>
            </Sheet>
        );
    }

    // Desktop → attached Popover (appears near the bell)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
                className="w-[380px] p-0 shadow-lg"
                align="end"
                sideOffset={8}
            >
                <div className="border-b px-5 py-3">
                    <h2 className="font-semibold">Notifications</h2>
                </div>
                {content}
            </PopoverContent>
        </Popover>
    );
}