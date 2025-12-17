'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
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
    Search,
    RefreshCcw,
    CoinsIcon,
    DollarSign,
    Coins,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatTimeAgo } from '@/lib/utils'

export default function AdminTransactionsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [refreshToggle, setRefreshToggle] = useState(false)

    // Fetch transactions (External Payments and Coin Transactions)
    const { data: transactionsData, isLoading: transactionsLoading, refetch } = useQuery({
        queryKey: ['admin-transactions', page, searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            })
            if (searchQuery) params.set('search', searchQuery)

            const response = await api.get(`/admin/payments?${params}`)
            if (response.status !== 200) throw new Error('Failed to fetch transactions')
            return response.data
        }
    })

    const stats = {
        totalCoinsSpent: transactionsData?.coinTransactions?.reduce((sum: number, tx: any) => sum + (tx.amount < 0 ? Math.abs(tx.amount) : 0), 0) || 0,
        totalPayments: transactionsData?.externalPayments?.reduce((sum: number, payment: any) => sum + payment.amountUSD, 0) || 0,
        totalTransactions: (transactionsData?.externalPayments?.length || 0) + (transactionsData?.coinTransactions?.length || 0)
    }

    function handleRefresh() {
        setRefreshToggle(true)
        refetch().finally(() => setRefreshToggle(false))
    }

    return (
    <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Transactions Management</h1>
                    <p className="text-muted-foreground">Manage all payment and coin transactions</p>
                </div>
                <Button variant="outline" onClick={handleRefresh}>
                    {
                        refreshToggle ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />
                    }
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Coins Spent</CardTitle>
                        <CoinsIcon className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCoinsSpent.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalPayments.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search transactions by user email..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {transactionsLoading ? (
                        <div className="p-8 text-center">Loading transactions...</div>
                    ) : (transactionsData?.externalPayments?.length === 0 && transactionsData?.coinTransactions?.length === 0) ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No transactions found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionsData?.externalPayments?.map((payment: any) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className='flex flex-col'>
                                            {payment.user.username}
                                            <span className='text-[10px] text-secondary-foreground'>{payment.user?.email || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                <DollarSign className="mr-1 h-4 w-4" />
                                                Payment
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${payment.amountUSD.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {payment.coinsGranted} coins ({payment.provider})
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                                {transactionsData?.coinTransactions?.map((tx: any) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className='flex flex-col'>
                                            {tx.user.username}
                                            <span className='text-[10px] text-secondary-foreground'>{tx.user?.email || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                <CoinsIcon className="mr-1 h-4 w-4" />
                                                Coin {tx.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='flex items-center gap-1'>{tx.amount > 0 ? '+' : ''}{tx.amount} <Coins className='text-yellow-500 w-4 h-4' /></TableCell>
                                        <TableCell >
                                            {tx.chapter ? `Chapter ${tx.chapter.order}: ${tx.chapter.novel.title}` : 'Coin PURCHASE'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge>{tx.type}</Badge>
                                        </TableCell>
                                        <TableCell>{formatTimeAgo(tx.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {transactionsData?.pages > 1 && (
                <div className="flex justify-center space-x-2">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>

                    {Array.from({ length: Math.min(5, transactionsData.pages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                            <Button
                                key={pageNum}
                                variant={page === pageNum ? 'default' : 'outline'}
                                onClick={() => setPage(pageNum)}
                            >
                                {pageNum}
                            </Button>
                        )
                    })}

                    <Button
                        variant="outline"
                        disabled={page === transactionsData.pages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}