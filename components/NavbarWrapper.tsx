// This has to be a Client Component to use usePathname
'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

function NavbarWrapper() {
    const pathname = usePathname()

    // Hide navbar on admin pages
    if (pathname.startsWith('/admin')) return null

    return <Navbar />
}

export default NavbarWrapper