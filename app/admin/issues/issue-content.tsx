"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Eye, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { DataTablePagination } from "@/components/pagination"
import api from "@/lib/axios"

const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    IN_REVIEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    RESOLVED: "bg-green-500/10 text-green-600 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
}

const issueTypeLabels = {
    TRANSLATION_ERROR: "Translation Error",
    FORMATTING_ERROR: "Formatting Error",
    MISSING_CONTENT: "Missing Content",
    INAPPROPRIATE_CONTENT: "Inappropriate Content",
    TECHNICAL_ISSUE: "Technical Issue",
    OTHER: "Other",
}

export function IssuesContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [reports, setReports] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState<any>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [adminNotes, setAdminNotes] = useState("")
    const [updating, setUpdating] = useState(false)

    const currentPage = Number.parseInt(searchParams.get("page") || "1")
    const statusFilter = searchParams.get("status") || "ALL"
    const typeFilter = searchParams.get("type") || "ALL"

    const fetchReports = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                status: statusFilter,
                type: typeFilter,
            })

            const response = await api.get(`/admin/issue?${params}`)
            const data = await response.data

            if (response.status !== 200) throw new Error(data.error)

            setReports(data.reports)
            setTotal(data.total)
            setTotalPages(data.totalPages)
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch reports")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [currentPage, statusFilter, typeFilter])

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "ALL") {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        params.set("page", "1")
        router.push(`?${params.toString()}`)
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            setUpdating(true)
            const response = await api.patch(`/admin/issue/${id}`, {
                data: { status, adminNotes },
            })

            const data = await response.data
            if (response.status !== 200 || !data.success) throw new Error(data.error)
            toast.success(`Report ${status.toLowerCase()} successfully`)
            setDialogOpen(false)
            setAdminNotes("")
            fetchReports()
        } catch (error: any) {
            toast.error(error.message || "Failed to update report")
        } finally {
            setUpdating(false)
        }
    }

    const openDialog = (report: any) => {
        setSelectedReport(report)
        setAdminNotes(report.adminNotes || "")
        setDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <>
            <div className="flex gap-4 flex-wrap">
                <Select value={statusFilter} onValueChange={(v) => updateFilter("status", v)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(v) => updateFilter("type", v)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        {Object.entries(issueTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border border-border/40 bg-zinc-900/20 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Reporter</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    No issue reports found
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id} className="border-border/40">
                                    <TableCell>
                                        <span className="text-sm font-medium">
                                            {issueTypeLabels[report.type as keyof typeof issueTypeLabels]}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {report.chapter ? (
                                            <div className="space-y-1">
                                                <Link
                                                    href={`/novel/${report.chapter.novel.slug}/chapter/${report.chapter.slug}`}
                                                    className="text-sm hover:underline flex items-center gap-1"
                                                >
                                                    {report.chapter.title}
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                                <p className="text-xs text-muted-foreground">{report.chapter.novel.title}</p>
                                            </div>
                                        ) : report.novel ? (
                                            <Link
                                                href={`/novel/${report.novel.slug}`}
                                                className="text-sm hover:underline flex items-center gap-1"
                                            >
                                                {report.novel.title}
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{report.reporter.username}</p>
                                            <p className="text-xs text-muted-foreground">{report.reporter.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={statusColors[report.status as keyof typeof statusColors]}>
                                            {report.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(report)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination currentPage={currentPage} totalPages={totalPages} totalItems={total} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Issue Report Details</DialogTitle>
                        <DialogDescription>Review and update the status of this report</DialogDescription>
                    </DialogHeader>

                    {selectedReport && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Type</Label>
                                    <p className="text-sm font-medium">
                                        {issueTypeLabels[selectedReport.type as keyof typeof issueTypeLabels]}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground mr-2">Status</Label>
                                    <Badge variant="outline" className={statusColors[selectedReport.status as keyof typeof statusColors]}>
                                        {selectedReport.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedReport.description}</p>
                            </div>

                            <div>
                                <Label htmlFor="admin-notes">Admin Notes</Label>
                                <Textarea
                                    id="admin-notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this report..."
                                    className="mt-1 min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        {selectedReport?.status !== "REJECTED" && (
                            <Button
                                variant="outline"
                                onClick={() => handleUpdateStatus(selectedReport.id, "REJECTED")}
                                disabled={updating}
                                className="gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                        )}
                        {selectedReport?.status !== "IN_REVIEW" && (
                            <Button
                                variant="outline"
                                onClick={() => handleUpdateStatus(selectedReport.id, "IN_REVIEW")}
                                disabled={updating}
                            >
                                Mark In Review
                            </Button>
                        )}
                        {selectedReport?.status !== "RESOLVED" && (
                            <Button
                                onClick={() => handleUpdateStatus(selectedReport.id, "RESOLVED")}
                                disabled={updating}
                                className="gap-2"
                            >
                                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Resolve
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
