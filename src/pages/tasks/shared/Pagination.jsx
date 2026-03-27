// ============================================================
// Pagination.jsx — Reusable pagination controls
// ============================================================
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, pageSize }) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, totalItems);

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-4">
      <p className="text-xs text-gray-500">
        Showing <span className="font-bold text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-bold text-gray-700">{totalItems}</span> entries
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <PaginationBtn
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous"
        >
          <ChevronLeft size={14} />
        </PaginationBtn>

        {/* Page numbers */}
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

        {/* Next */}
        <PaginationBtn
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next"
        >
          <ChevronRight size={14} />
        </PaginationBtn>
      </div>
    </div>
  );
};

const PaginationBtn = ({ children, onClick, disabled, active, ...rest }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center
      ${active   ? 'bg-yellow-400 text-black shadow-sm'       : ''}
      ${disabled ? 'opacity-30 cursor-not-allowed'            : ''}
      ${!active && !disabled ? 'text-gray-600 hover:bg-gray-100' : ''}
    `}
    {...rest}
  >
    {children}
  </button>
);

// Build smart page range: always show first, last, current ±1
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
    result.push(p);
  });
  return result;
}

export default Pagination;
