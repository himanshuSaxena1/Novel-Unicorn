// app/layout.tsx (Server)
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { SafeToaster } from '@/components/SafeToaster'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <SafeToaster />
        </Providers>
      </body>
    </html>
  )
}
