import { Pagination as PaginationType } from "@/types/api-response"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface CustomPaginationProps {
    pagination: PaginationType
    onPageChange: (page: number) => void
}

export function CustomPagination({ pagination, onPageChange }: CustomPaginationProps) {
    const { page: currentPage, totalPages, hasNext, hasPrev } = pagination

    const totalPagesCount = Math.max(totalPages, 1)
    const pageNumbers: (number | string)[] = []
    const delta = 1

    for (let i = 1; i <= totalPagesCount; i++) {
        if (
            i === 1 ||
            i === totalPagesCount ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            pageNumbers.push(i)
        } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
            pageNumbers.push("...")
        }
    }

    const hasPreviousPage = hasPrev ?? currentPage > 1
    const hasNextPage = hasNext ?? currentPage < totalPagesCount

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault()
        if (hasPreviousPage) onPageChange(currentPage - 1)
    }

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault()
        if (hasNextPage) onPageChange(currentPage + 1)
    }

    const handlePageClick = (e: React.MouseEvent, pageNum: number) => {
        e.preventDefault()
        onPageChange(pageNum)
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <span className="text-xs text-muted-foreground">
                Menampilkan halaman{" "}
                <span className="font-medium text-slate-800">{currentPage}</span> dari{" "}
                <span className="font-medium text-slate-800">{totalPages}</span>{" "}
                ({pagination.totalData} total data)
            </span>
            <Pagination className="mx-0! w-auto!">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={handlePrev}
                            className={cn(
                                "cursor-pointer bg-white hover:bg-slate-50 hover:text-slate-700! border border-slate-200 text-slate-700 size-9 flex items-center justify-center p-0! pl-0! pr-0!",
                                !hasPreviousPage && "pointer-events-none opacity-50"
                            )}
                            text=""
                            size="icon"
                        />
                    </PaginationItem>

                    {pageNumbers.map((pageNum, index) => {
                        if (pageNum === "...") {
                            return (
                                <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationEllipsis className="bg-white border border-slate-200 text-slate-400 size-9 rounded-md flex items-center justify-center text-xs" />
                                </PaginationItem>
                            )
                        }

                        const isActive = pageNum === currentPage

                        return (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href="#"
                                    isActive={isActive}
                                    onClick={(e) => handlePageClick(e, pageNum as number)}
                                    className={cn(
                                        "cursor-pointer size-9 rounded-md flex items-center justify-center transition-colors border text-xs font-medium",
                                        isActive
                                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground!"
                                            : "bg-white hover:bg-slate-50 hover:text-slate-700! border-slate-200 text-slate-700"
                                    )}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={handleNext}
                            className={cn(
                                "cursor-pointer bg-white hover:bg-slate-50 hover:text-slate-700! border border-slate-200 text-slate-700 size-9 flex items-center justify-center p-0! pl-0! pr-0!",
                                !hasNextPage && "pointer-events-none opacity-50"
                            )}
                            text=""
                            size="icon"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
