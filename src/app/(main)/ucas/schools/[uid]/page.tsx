import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SearchableUniversityContent from '@/lib/customui/UCAS/SearchableUniversityContent';

export default async function UniversityPage({ params }: { params: { uid: string } }) {
  const page_params = await params;
  const university = await prisma.university.findUnique({
    where: {
      id: page_params.uid
    },
    include: {
      courseLinks: {
        include: {
          course: true
        }
      },
      stats: true,
    }
  });

  if (!university) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      universities: {
        has: university.name
      }
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto py-8">
      <SearchableUniversityContent 
        university={university}
        courseLinks={university.courseLinks}
        stats={university.stats}
        posts={posts}
      />
    </div>
  );
}