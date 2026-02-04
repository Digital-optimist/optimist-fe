"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// =============================================================================
// Blog Pagination - Numbered pagination for blog listing
// =============================================================================

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white py-8 md:py-10 lg:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? "text-[#D0D5DD] cursor-not-allowed"
                : "text-[#344054] hover:bg-[#F2F4F7]"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          {pageNumbers.map((page, index) =>
            typeof page === "string" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[14px] text-[#667085]"
              >
                {page}
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-[#1265FF] text-white shadow-md"
                    : "text-[#344054] hover:bg-[#F2F4F7]"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? "text-[#D0D5DD] cursor-not-allowed"
                : "text-[#344054] hover:bg-[#F2F4F7]"
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogPagination;
