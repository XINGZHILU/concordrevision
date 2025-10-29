import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SearchableCourseLinkContent from '@/lib/customui/UCAS/SearchableCourseLinkContent';

export default async function UniversityCoursePage({
  params
}: {
  params: { uid: string; cid: string };
}) {
  const page_params = await params;
  const courseLink = await prisma.courseLink.findUnique({
    where: {
      id: parseInt(page_params.cid)
    },
    include: {
      university: true,
      course: true
    }
  });

  if (!courseLink || courseLink.universityId !== page_params.uid) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      AND: [
        {
          universities: {
            has: courseLink.university.name
          }
        },
        {
          courses: {
            has: courseLink.course.name
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
      <SearchableCourseLinkContent 
        courseLink={courseLink}
        posts={posts}
      />
    </div>
  );
} 