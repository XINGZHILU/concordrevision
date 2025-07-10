'use client';

import { useState, useEffect, useMemo } from 'react';
import { UniversityCard } from './cards';
import { Search } from './search';
import { Pagination } from './pagination';
import { University } from '@prisma/client';

export function UniversityList({ universities }: { universities: University[] }) {
  const [displayedUniversities, setDisplayedUniversities] = useState<University[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');

  const filteredUniversities = useMemo(() => {
    return universities.filter(university => {
      const matchesSearch = university.name.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = location === 'all' || (location === 'uk' && university.uk) || (location === 'overseas' && !university.uk);
      return matchesSearch && matchesLocation;
    });
  }, [universities, search, location]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredUniversities.length / 12));
    const paginatedUniversities = filteredUniversities.slice((currentPage - 1) * 12, currentPage * 12);
    setDisplayedUniversities(paginatedUniversities);
  }, [filteredUniversities, currentPage]);


  return (
    <div>
      <Search setSearch={setSearch} setLocation={setLocation} />
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