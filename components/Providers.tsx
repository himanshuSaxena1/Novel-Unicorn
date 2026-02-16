'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import NavbarWrapper from './NavbarWrapper'
import { SafeToaster } from './SafeToaster'
import FooterWrapper from './FooterWrapper'
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        gcTime: 10 * 60 * 1000, // 10 minutes
                    },
                },
            })
    )
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <NavbarWrapper />
                {children}
                <FooterWrapper />
                <SafeToaster />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </SessionProvider>
    )
}
