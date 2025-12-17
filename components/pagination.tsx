"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface DataTablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
}

export function DataTablePagination({ currentPage, totalPages, totalItems }: DataTablePaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const handlePageChange = (page: number) => {
        router.push(createPageURL(page))
    }

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "ellipsis", totalPages)
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
            pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages)
        }

        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:px-2">
            <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages} ({totalItems.toLocaleString()} total items)
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={createPageURL(currentPage - 1)}
                            onClick={(e) => {
                                if (currentPage <= 1) {
                                    e.preventDefault()
                                    return
                                }
                                e.preventDefault()
                                handlePageChange(currentPage - 1)
                            }}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) =>
                        page === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href={createPageURL(page)}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageChange(page)
                                    }}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href={createPageURL(currentPage + 1)}
                            onClick={(e) => {
                                if (currentPage >= totalPages) {
                                    e.preventDefault()
                                    return
                                }
                                e.preventDefault()
                                handlePageChange(currentPage + 1)
                            }}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
