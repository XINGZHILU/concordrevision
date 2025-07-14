import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import { CourseList } from '@/lib/customui/UCAS/CourseList';

export default async function CoursePage() {
  const courses = await prisma.course.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className='w-11/12 mx-auto'>
      <h1 className="text-4xl font-bold my-8">Courses</h1>
      <Suspense fallback={<p>Loading courses...</p>}>
        <CourseList courses={courses} />
      </Suspense>
    </div>
  )
} 