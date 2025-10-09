"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type ReaderTheme = "system" | "light" | "dark" | "sepia"
type ReaderFont = "serif" | "sans"
type ReaderWidth = "normal" | "wide"

export interface ReaderPrefs {
    theme: ReaderTheme
    font: ReaderFont
    fontSize: number // pixels
    lineHeight: number // unitless
    width: ReaderWidth
}

type Ctx = {
    prefs: ReaderPrefs
    setPrefs: (next: Partial<ReaderPrefs>) => void
    increaseFont: () => void
    decreaseFont: () => void
}

const DEFAULT_PREFS: ReaderPrefs = {
    theme: "system",
    font: "serif",
    fontSize: 18,
    lineHeight: 1.6,
    width: "normal",
}

const MIN_FONT = 14
const MAX_FONT = 28

const ReaderContext = createContext<Ctx | null>(null)

function useLocalStorage<T>(key: string, initial: T) {
    const [state, setState] = useState<T>(initial)
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(key)
            if (raw != null) setState(JSON.parse(raw))
        } catch { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state))
        } catch { }
    }, [key, state])
    return [state, setState] as const
}

export function ReaderProvider({ children }: { children: React.ReactNode }) {
    const [prefs, setStored] = useLocalStorage<ReaderPrefs>("reader:prefs:v1", DEFAULT_PREFS)

    const setPrefs = (next: Partial<ReaderPrefs>) => {
        setStored((prev) => ({ ...prev, ...next }))
    }

    const increaseFont = () => {
        setStored((prev) => ({ ...prev, fontSize: Math.min(MAX_FONT, prev.fontSize + 1) }))
    }
    const decreaseFont = () => {
        setStored((prev) => ({ ...prev, fontSize: Math.max(MIN_FONT, prev.fontSize - 1) }))
    }

    const value = useMemo<Ctx>(() => ({ prefs, setPrefs, increaseFont, decreaseFont }), [prefs])

    return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
}

export function useReader() {
    const ctx = useContext(ReaderContext)
    if (!ctx) throw new Error("useReader must be used within ReaderProvider")
    return ctx
}

export const FONT_MIN = MIN_FONT
export const FONT_MAX = MAX_FONT
