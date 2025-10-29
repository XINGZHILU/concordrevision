'use client';

import { useState, useEffect, useMemo } from 'react';
import { UniversityCard } from '@/lib/customui/UCAS/cards';
import { Search } from '@/lib/customui/UCAS/search';
import { Pagination } from '@/lib/customui/UCAS/pagination';
import { University, UCASSubject } from '@prisma/client';
import { Select } from '@/lib/components/ui/select';

type UniversityWithCourses = University & {
  courses: {
    ucasSubjectId: string;
  }[];
};

export function UniversityList({ universities, ucasSubjects }: { 
  universities: UniversityWithCourses[];
  ucasSubjects: UCASSubject[];
}) {
  const [displayedUniversities, setDisplayedUniversities] = useState<UniversityWithCourses[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredUniversities = useMemo(() => {
    return universities.filter(university => {
      const matchesSearch = university.name.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = location === 'all' || (location === 'uk' && university.uk) || (location === 'overseas' && !university.uk);
      const matchesSubject = selectedSubject === 'all' || university.courses.some(course => course.ucasSubjectId === selectedSubject);
      return matchesSearch && matchesLocation && matchesSubject;
    });
  }, [universities, search, location, selectedSubject]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredUniversities.length / 12));
    const paginatedUniversities = filteredUniversities.slice((currentPage - 1) * 12, currentPage * 12);
    setDisplayedUniversities(paginatedUniversities);
  }, [filteredUniversities, currentPage]);


  return (
    <div>
      <div className="space-y-4 mb-6">
        <Search setSearch={setSearch} setLocation={setLocation} />
        
        {/* Subject Filter */}
        <div className="max-w-md">
          <label htmlFor="subject-filter" className="block text-sm font-medium mb-2">
            Filter by Subject
          </label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Subjects</option>
            {ucasSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {selectedSubject !== 'all' && (
            <p className="mt-2 text-sm text-muted-foreground">
              Showing universities offering {ucasSubjects.find(s => s.id === selectedSubject)?.name}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredUniversities.length} universit{filteredUniversities.length !== 1 ? 'ies' : 'y'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {displayedUniversities.map((university) => (
          <UniversityCard university={university} key={university.id} />
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