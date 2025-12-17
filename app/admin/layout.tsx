"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  FileText,
  Menu,
  BarChart3,
  Crown,
  MessageSquareMore,
  Bell,
  Search,
  ChevronRight,
  Flag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Novels", href: "/admin/novels", icon: BookOpen },
  { name: "Chapters", href: "/admin/chapters", icon: FileText },
  { name: "Comments", href: "/admin/comments", icon: MessageSquareMore },
  { name: "Issues", href: "/admin/issues", icon: Flag },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscriptions", href: "/admin/coins", icon: Crown },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Suspense>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 flex h-16 items-center gap-x-4  bg-card px-4 shadow-sm">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
          <AdminSidebar />
        </div>

        {/* Main content */}
        <div className="md:pl-72">
          {/* Desktop Header */}
          <div className="hidden md:flex sticky top-0 z-40 h-16 items-center gap-x-4  bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 shadow-sm">
            <div className="flex flex-1 gap-x-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/diverse-avatars.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>

          {/* Page content */}
          <main className="flex-1 border  md:rounded-tl-3xl dark:bg-[#252e1b] min-h-[calc(100vh-4rem)] bg-white">
            <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </Suspense>
  )
}

function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-y-5 overflow-y-auto  bg-card px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="flex items-center gap-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-tight">Admin Panel</span>
            <span className="text-xs text-muted-foreground">Content Management</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wide mb-2">
              Main Menu
            </div>
            <ul role="list" className="space-y-1">
              {navigation.slice(0, 4).map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "text-white" : "",
                        )}
                      />
                      <span>{item.name}</span>
                      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          <li>
            <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wide mb-2">
              Management
            </div>
            <ul role="list" className="space-y-1">
              {navigation.slice(4).map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "text-white" : "",
                        )}
                      />
                      <span>{item.name}</span>
                      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>

          {/* User Profile Section */}
          <li className="mt-auto">
            <div className="rounded-lg border bg-muted/30 p-2 md:p-4">
              <div className="flex items-center gap-x-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/diverse-avatars.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
                </div>
              </div>
              <Link
                href="/"
                className="flex items-center justify-center gap-x-2 rounded-md bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Back to Site
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
