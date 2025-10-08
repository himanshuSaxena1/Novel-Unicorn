'use client'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

export function SafeToaster() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                },
            }}
        />
    )
}
