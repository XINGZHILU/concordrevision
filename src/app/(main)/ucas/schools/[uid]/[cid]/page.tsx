import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SearchableCourseContent from '@/lib/customui/UCAS/SearchableCourseContent';

/**
 * Page displaying a specific course at a specific university
 */
export default async function UniversityCoursePage({
  params
}: {
  params: { uid: string; cid: string };
}) {
  const page_params = await params;
  const course = await prisma.course.findUnique({
    where: {
      id: parseInt(page_params.cid)
    },
    include: {
      university: true,
      ucasSubject: true
    }
  });

  if (!course || course.universityId !== page_params.uid) {
    notFound();
  }

  // Filter posts by university ID and UCAS subject ID instead of names
  const posts = await prisma.uCASPost.findMany({
    where: {
      AND: [
        {
          universities: {
            has: course.university.id
          }
        },
        {
          ucasSubjects: {
            has: course.ucasSubject.id
          }
        }
      ]
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto py-8">
      <SearchableCourseContent 
        course={course}
        posts={posts}
      />
    </div>
  );
} 