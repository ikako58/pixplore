// Pagination component
// Accessible navigation for page-based content

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onHoverNext?: () => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onHoverNext,
  disabled = false,
}: PaginationProps) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination navigation"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev || disabled}
        aria-label="Go to previous page"
        className="hover:bg-accent"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={page === currentPage ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={disabled}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          ) : (
            <span
              key={index}
              className="px-2 text-muted-foreground"
              aria-hidden="true"
            >
              {page}
            </span>
          )
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        onMouseEnter={onHoverNext}
        disabled={!canGoNext || disabled}
        aria-label="Go to next page"
        className="hover:bg-accent"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </nav>
  );
}
