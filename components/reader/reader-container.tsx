"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { useReader } from "./reader-provider"

interface ReaderContainerProps {
    className?: string
    children: React.ReactNode
}

export function ReaderContainer({ className, children }: ReaderContainerProps) {
    const { prefs } = useReader()

    const themeClass = prefs.theme === "dark" ? "dark" : prefs.theme === "sepia" ? "reader-theme-sepia" : ""

    const wrapperClasses = cn(
        "reader-surface",
        themeClass,
        // spacing and background for the reading surface
        "py-4 md:py-6 rounded-md",
        className,
    )

    const contentClasses = cn(
        prefs.font === "serif" ? "font-serif" : "font-sans",
        prefs.width === "wide" ? "max-w-5xl" : "max-w-3xl",
        "mx-auto",
    )

    return (
        <section
            className={wrapperClasses}
            style={{
                fontSize: `${prefs.fontSize}px`,
                lineHeight: prefs.lineHeight,
            }}
            aria-label="Reading area"
            role="region"
        >
            <div className={contentClasses}>{children}</div>
        </section>
    )
}
