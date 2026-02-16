'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Coins as CoinsIcon,
  Library,
  List,
  BookOpenText,
  Menu,
  X,
  SunMoonIcon,
} from 'lucide-react'
import { NotificationBell } from './notifications/NotificationBell'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()

  const isAdminOrMod =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR'

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-3 sm:px-1 lg:px-0">
        <div className="flex h-16 items-center justify-between">
          {/* Left – Logo + main nav (desktop) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <BookOpenText className="h-7 w-7 text-primary" strokeWidth={1.8} />
              <span className="hidden text-xl font-bold tracking-tight sm:inline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Unique Novels
              </span>
              <span className="text-xl font-bold tracking-tight sm:hidden bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                UN
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5">
              <Link href="/browse">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <List className="h-4 w-4" />
                  Browse
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {session?.user && (
              <div className="hidden items-center gap-4 sm:flex">
                <Link
                  href="/coins"
                  className=" flex items-center gap-2 rounded-md  text-base font-medium text-amber-700 hover:bg-amber-50/80 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <CoinsIcon className="h-4 w-4 text-amber-600" />
                  <span>{session.user.coinBalance ?? 0}</span>
                </Link>

                <NotificationBell />
              </div>
            )}
            {/* User / Auth */}
            {status === 'loading' ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 gap-2 rounded-full px-2 hover:bg-accent sm:px-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <span className="hidden font-medium sm:inline">
                      {session.user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-screen mt-2 rounded-none md:w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="py-2.5">
                      <User className="mr-2.5 h-4.5 w-4.5" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/library" className="py-2.5">
                      <Library className="mr-2.5 h-4.5 w-4.5" />
                      My Library
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className='hover:bg-transparent hover:bg-none'>
                    <div className='flex items-center justify-between'>
                      <span className='flex items-center'><SunMoonIcon className="h-5 w-5 mr-5 md:mr-4" /> Mode</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-base"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      >
                        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    </div>
                  </DropdownMenuItem>
                  {isAdminOrMod && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="py-2.5 text-amber-600">
                          <Settings className="mr-2.5 h-4.5 w-4.5" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30 py-2.5"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="mr-2.5 h-4.5 w-4.5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background/95 backdrop-blur-md md:hidden">
          <div className="space-y-2 px-5 py-3">
            <Link
              href="/browse"
              className="block rounded-lg px-4 py-3 text-base font-medium hover:bg-accent"
              onClick={() => setMobileOpen(false)}
            >
              Browse Novels
            </Link>

            {session ? (
              <>


                <div className="space-y-1">

                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setMobileOpen(false)
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/10 px-4 py-3 font-medium text-red-700 hover:bg-red-600/20 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="grid gap-4 pt-3">
                <Button asChild size="lg">
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}