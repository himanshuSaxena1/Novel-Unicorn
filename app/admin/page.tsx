'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart
} from 'lucide-react'

// Mock data - replace with actual data fetching
const DASHBOARD_STATS = {
  users: { total: 15420, change: +12.5, trend: 'up' },
  novels: { total: 1247, change: +8.2, trend: 'up' },
  chapters: { total: 28593, change: +15.7, trend: 'up' },
  revenue: { total: 45680, change: -2.1, trend: 'down' },
  subscribers: { total: 3450, change: +18.3, trend: 'up' },
  views: { total: 892340, change: +7.8, trend: 'up' }
}

const RECENT_NOVELS = [
  { id: '1', title: 'The Dragon\'s Legacy', author: 'John Smith', chapters: 45, status: 'ONGOING' },
  { id: '2', title: 'Cyber Revolution 2087', author: 'Jane Doe', chapters: 32, status: 'ONGOING' },
  { id: '3', title: 'Magic Academy Chronicles', author: 'Mike Wilson', chapters: 67, status: 'COMPLETED' },
]

const TOP_NOVELS = [
  { title: 'Immortal Cultivator Path', views: 145230, rating: 4.8 },
  { title: 'System Apocalypse', views: 98765, rating: 4.6 },
  { title: 'Virtual Reality Master', views: 87432, rating: 4.7 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DASHBOARD_STATS.users.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {DASHBOARD_STATS.users.trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={DASHBOARD_STATS.users.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {DASHBOARD_STATS.users.change > 0 ? '+' : ''}{DASHBOARD_STATS.users.change}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Novels</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DASHBOARD_STATS.novels.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{DASHBOARD_STATS.novels.change}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DASHBOARD_STATS.chapters.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{DASHBOARD_STATS.chapters.change}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${DASHBOARD_STATS.revenue.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500">{DASHBOARD_STATS.revenue.change}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Subscribers</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DASHBOARD_STATS.subscribers.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{DASHBOARD_STATS.subscribers.change}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DASHBOARD_STATS.views.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{DASHBOARD_STATS.views.change}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Novels */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Novels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_NOVELS.map((novel) => (
                <div key={novel.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{novel.title}</p>
                    <p className="text-sm text-muted-foreground">by {novel.author}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{novel.chapters} chapters</Badge>
                    <Badge variant={novel.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {novel.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Novels */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Novels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TOP_NOVELS.map((novel, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{novel.title}</p>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-xs">{novel.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{novel.views.toLocaleString()} views</span>
                    <Progress value={75} className="w-16 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Add New Novel</div>
                  <div className="text-xs text-muted-foreground">Create a new novel</div>
                </div>
              </div>
            </Button>
            
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Add Chapter</div>
                  <div className="text-xs text-muted-foreground">Write new chapter</div>
                </div>
              </div>
            </Button>
            
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Manage Users</div>
                  <div className="text-xs text-muted-foreground">View all users</div>
                </div>
              </div>
            </Button>
            
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-muted-foreground">Detailed reports</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}