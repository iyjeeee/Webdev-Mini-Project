import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Builds smart page range: always shows first, last, current ±1 with ellipsis
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pageSet = new Set(
    [1, total, current, current - 1, current + 1].filter((p) => p >= 1 && p <= total)
  );
  const sorted = [...pageSet].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…'); // add ellipsis for gaps
    result.push(p);
  });
  return result;
}

// Individual page button with active/disabled styling
const PaginationBtn = ({ children, onClick, disabled, active, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={[
      'min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center',
      active   ? 'bg-yellow-400 text-black shadow-sm cursor-pointer'      : '',
      disabled ? 'opacity-30 cursor-not-allowed'                          : '',
      !active && !disabled ? 'text-gray-600 hover:bg-gray-100 cursor-pointer' : '',
    ].join(' ')}
  >
    {children}
  </button>
);

// Main Pagination component — always renders so layout is stable
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, pageSize }) => {
  // Always render pagination — keeps layout height stable even with few records

  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, totalItems);
  const pages = buildPages(currentPage, totalPages);

  // When all records fit on one page, show disabled first/last and current page
  const safeTotalPages = totalPages || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-4">
      {/* Entry count label */}
      <p className="text-xs text-gray-500">
        Showing <span className="font-bold text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-bold text-gray-700">{totalItems}</span> entries
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <PaginationBtn
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous"
        >
          <ChevronLeft size={14} />
        </PaginationBtn>

        {/* Page number buttons with ellipsis */}
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          ) : (
            <PaginationBtn
              key={p}
              onClick={() => onPageChange(p)}
              active={p === currentPage}
            >
              {p}
            </PaginationBtn>
          )
        )}

        {/* Next button */}
        <PaginationBtn
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          aria-label="Next"
        >
          <ChevronRight size={14} />
        </PaginationBtn>
      </div>
    </div>
  );
};

export default Pagination;
