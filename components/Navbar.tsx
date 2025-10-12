'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Moon,
  Sun,
  User,
  BookOpen,
  Settings,
  LogOut,
  Crown,
  Menu,
  X,
  BookOpenText,
  List,
  CirclePoundSterling,
} from 'lucide-react'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <BookOpenText className="h-7 w-7 text-primary hidden sm:block" />
          <span className="hidden sm:flex text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Unique Novels
          </span>
          <span className="flex sm:hidden text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            UN
          </span>
        </Link>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search novels, authors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right - Menu */}
        <div className="flex items-center space-x-3">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/browse">
              <Button className='flex items-center' variant="ghost" size="sm">
                <List className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </Link>

          </div>
          {
            session?.user && (
              <Link href="/coins" className='flex items-center gap-1'>
                <CirclePoundSterling className="h-4 w-4 text-yellow-600" />
                {session?.user.coinBalance}
              </Link>
            )
          }

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Menu or Auth Buttons */}
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">

                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{session.user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/library" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/coins" className="flex items-center">
                    <Crown className="mr-2 h-4 w-4" />
                    Coins
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm animate-in slide-in-from-top">
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search novels, authors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link href="/browse" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Browse
              </Button>
            </Link>

            <Link href="/coins" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>Premium</span>
              </Button>
            </Link>

            {!session ? (
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
