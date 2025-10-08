'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  Settings, 
  FileText,
  Menu,
  BarChart3,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Novels', href: '/admin/novels', icon: BookOpen },
  { name: 'Chapters', href: '/admin/chapters', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: Crown },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background pt-0">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden fixed top-2 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 border-r">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="flex items-center space-x-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Admin Panel</span>
        </Link>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          
          <li className="mt-auto">
            <Link
              href="/"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <BookOpen className="h-5 w-5 shrink-0" />
              Back to Site
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}