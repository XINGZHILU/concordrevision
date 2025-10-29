import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SearchableCourseContent from '@/lib/customui/UCAS/SearchableCourseContent';

export default async function CoursePage({ params }: { params: { cid: string } }) {
  const page_params = await params;
  const course = await prisma.course.findUnique({
    where: {
      id: page_params.cid
    },
    include: {
      courseLinks: {
        include: {
          university: true
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      courses: { // Note the typo in the schema
        has: course.name
      }
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto py-8">
      <SearchableCourseContent 
        course={course}
        courseLinks={course.courseLinks}
        posts={posts}
      />
    </div>
  );
} 