'use client';

import { Button } from '@/lib/components/ui/button';

export function Pagination({ totalPages, currentPage, setCurrentPage }: { totalPages: number, currentPage: number, setCurrentPage: (page: number) => void }) {

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
} 