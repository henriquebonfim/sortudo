import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizes?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizes = [5, 10, 20, 30, 50, 100],
  className = '',
}: PaginationProps) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    // Safeguard: If current page becomes greater than total pages (e.g. after changing page size)
    // reset to the last possible page or back to 1.
    if (totalPages > 0 && currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      onPageChange(val);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setInputValue(currentPage.toString());
      (e.target as HTMLInputElement).blur();
    }
  };

  if (totalPages <= 1 && !onPageSizeChange) return null;

  return (
    <div className={`flex justify-center flex-row items-baseline  gap-4 ${className}`}>

      <div className="flex flex-col items-center gap-2">
        {/* Page Indicator */}
        <p className="hidden sm:block text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">
          Página {currentPage} de {totalPages}
        </p>

        {/* Navigation Controls */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold font-mono min-w-[80px] justify-center">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-5 bg-transparent border-none text-center outline-none focus:text-primary transition-colors border-b border-transparent focus:border-primary/30"
              title="Ir para página"
            />
            <span className="opacity-40">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page Size Selector */}
        {onPageSizeChange && pageSize !== undefined && (
          <div className="flex  items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-black/40 border border-white/10 rounded-lg text-xs font-bold p-1.5 outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {pageSizes.map((size) => (
                <option key={size} value={size} className="bg-background">
                  {size} itens
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
