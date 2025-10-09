// app/layout.tsx (Server)
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { SafeToaster } from '@/components/SafeToaster'
import NavbarWrapper from '@/components/NavbarWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
           <NavbarWrapper />
          <main>{children}</main>
          <SafeToaster />
        </Providers>
      </body>
    </html>
  )
}
