'use client';

import { useState, useEffect, useMemo } from 'react';
import { UCASSubjectCard } from '@/lib/customui/UCAS/cards';
import { Pagination } from '@/lib/customui/UCAS/pagination';
import { UCASSubject, University } from '@prisma/client';
import { Input } from '@/lib/components/ui/input';

type UCASSubjectWithCourses = UCASSubject & {
  courses: {
    universityId: string;
  }[];
};

/**
 * Component displaying a searchable and paginated list of UCAS subjects
 */
export function UCASSubjectList({ ucasSubjects, universities }: { 
  ucasSubjects: UCASSubjectWithCourses[];
  universities: University[];
}) {
  const [displayedSubjects, setDisplayedSubjects] = useState<UCASSubjectWithCourses[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');

  const filteredSubjects = useMemo(() => {
    return ucasSubjects.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(search.toLowerCase());
      const matchesUniversity = selectedUniversity === 'all' || subject.courses.some(course => course.universityId === selectedUniversity);
      return matchesSearch && matchesUniversity;
    });
  }, [ucasSubjects, search, selectedUniversity]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSubjects.length / 12));
    const paginatedSubjects = filteredSubjects.slice((currentPage - 1) * 12, currentPage * 12);
    setDisplayedSubjects(paginatedSubjects);
  }, [filteredSubjects, currentPage]);


  return (
    <div>
      <div className="space-y-4 mb-6">
        <Input
          placeholder="Search for a UCAS subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* University Filter */}
        <div className="max-w-md">
          <label htmlFor="university-filter" className="block text-sm font-medium mb-2">
            Filter by University
          </label>
          <select
            id="university-filter"
            value={selectedUniversity}
            onChange={(e) => {
              setSelectedUniversity(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Universities</option>
            {universities.map(university => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {selectedUniversity !== 'all' && (
            <p className="mt-2 text-sm text-muted-foreground">
              Showing subjects offered at {universities.find(u => u.id === selectedUniversity)?.name}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''}
      </p>

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

