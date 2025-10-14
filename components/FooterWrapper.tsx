// This has to be a Client Component to use usePathname
'use client'
import { usePathname } from 'next/navigation'
import Footer from './footer'

function FooterWrapper() {
    const pathname = usePathname()

    // Hide navbar on admin pages
    if (pathname.startsWith('/admin')) return null

    return <Footer />
}

export default FooterWrapper