'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CourseCard } from './cards';

export function CourseList({ courses }: {
  courses: {
    name: string;
    id: string;
    slug: string
    universityId: string;
  }[]
}) {
  const [search, setSearch] = useState('');

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  return (
    <div>
      <Input
        placeholder="Search for a course..."
        onChange={(e) => setSearch(e.target.value)}
        className="my-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
} 