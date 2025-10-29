'use client';

import { useState, useEffect, useMemo } from 'react';
import { UCASSubjectCard } from '@/lib/customui/UCAS/cards';
import { Pagination } from '@/lib/customui/UCAS/pagination';
import { UCASSubject } from '@prisma/client';
import { Input } from '@/lib/components/ui/input';

/**
 * Component displaying a searchable and paginated list of UCAS subjects
 */
export function UCASSubjectList({ ucasSubjects }: { ucasSubjects: UCASSubject[] }) {
  const [displayedSubjects, setDisplayedSubjects] = useState<UCASSubject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const filteredSubjects = useMemo(() => {
    return ucasSubjects.filter(subject => {
      return subject.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [ucasSubjects, search]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSubjects.length / 12));
    const paginatedSubjects = filteredSubjects.slice((currentPage - 1) * 12, currentPage * 12);
    setDisplayedSubjects(paginatedSubjects);
  }, [filteredSubjects, currentPage]);


  return (
    <div>
      <Input
        placeholder="Search for a UCAS subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {displayedSubjects.map((subject) => (
          <UCASSubjectCard ucasSubject={subject} key={subject.id} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

