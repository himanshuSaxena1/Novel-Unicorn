// app/layout.tsx (Server)
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html >
  )
}
