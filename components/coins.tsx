// components/StarsDisplay.tsx
"use client"

import { useSession } from "next-auth/react"
import { Coins, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import api from "@/lib/axios"

export function StarsDisplay() {
    const sessionHook = useSession()
    const session = sessionHook?.data;
    const [stars, setStars] = useState<number>(0)
    const router = useRouter()

    // Fetch stars when the session is available
    useEffect(() => {
        if (session?.user) {
            // Fetch stars from the server-side action or API route
            const fetchStars = async () => {
                try {
                    const res = await api.get(`/user/${session.user.id}/coins`)
                    const data = await res.data;
                    setStars(data.stars || 0)
                } catch (error) {
                    console.error("Error fetching stars:", error)
                }
            }

            fetchStars()
        }
    }, [session])

    if (!session?.user) {
        return null
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 px-2 py-1 h-auto"
                        onClick={() => router.push("/stars")}
                    >
                        <Coins className="h-5 w-5 fill-none text-yellow-400" />
                        <span className="font-medium">{stars}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Your stars - Click to buy more</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
