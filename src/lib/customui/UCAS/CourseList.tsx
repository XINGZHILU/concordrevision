'use client';

import { useState, useEffect, useMemo } from 'react';
import { CourseCard } from '@/lib/customui/UCAS/cards';
import { Pagination } from '@/lib/customui/UCAS/pagination';
import { Course } from '@prisma/client';
import { Input } from '@/lib/components/ui/input';

export function CourseList({ courses }: { courses: Course[] }) {
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      return course.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [courses, search]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCourses.length / 12));
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * 12, currentPage * 12);
    setDisplayedCourses(paginatedCourses);
  }, [filteredCourses, currentPage]);


  return (
    <div>
      <Input
        placeholder="Search for a course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {displayedCourses.map((course) => (
          <CourseCard course={course} key={course.id} />
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