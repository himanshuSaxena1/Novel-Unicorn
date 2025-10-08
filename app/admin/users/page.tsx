'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Ban, Crown, Users, UserCheck, UserX, Shield } from 'lucide-react'

const ROLE_COLORS = {
  USER: 'bg-blue-500',
  AUTHOR: 'bg-green-500',
  ADMIN: 'bg-red-500'
}

const SUBSCRIPTION_COLORS = {
  FREE: 'bg-gray-500',
  SMALL: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500', 
  PREMIUM: 'bg-purple-500'
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, searchQuery, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })
      
      if (searchQuery) params.set('search', searchQuery)
      if (roleFilter !== 'ALL') params.set('role', roleFilter)
      
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    }
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Manage all users on your platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users?.filter((u: any) => u.emailVerified).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Subscribers</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users?.filter((u: any) => u.subscriptions?.length > 0).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authors</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.users?.filter((u: any) => u.role === 'AUTHOR').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Role: {roleFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRoleFilter('ALL')}>
              All Roles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('USER')}>
              Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('AUTHOR')}>
              Authors
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter('ADMIN')}>
              Admins
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users?.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[user.role as keyof typeof ROLE_COLORS]}`} />
                        <span>{user.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user.subscriptions?.length > 0 ? (
                          <>
                            <div className={`w-2 h-2 rounded-full ${SUBSCRIPTION_COLORS[user.subscriptions[0].plan.tier as keyof typeof SUBSCRIPTION_COLORS]}`} />
                            <span>{user.subscriptions[0].plan.tier}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                            <span>FREE</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                        {user.emailVerified ? 'Active' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Crown className="mr-2 h-4 w-4" />
                            Change Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}