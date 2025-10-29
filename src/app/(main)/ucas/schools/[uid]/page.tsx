import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SearchableUniversityContent from '@/lib/customui/UCAS/SearchableUniversityContent';

/**
 * Page displaying a specific university with its courses and admission stats
 */
export default async function UniversityPage({ params }: { params: { uid: string } }) {
  const page_params = await params;
  const university = await prisma.university.findUnique({
    where: {
      id: page_params.uid
    },
    include: {
      courses: {
        include: {
          ucasSubject: true
        }
      },
      stats: true,
    }
  });

  if (!university) {
    notFound();
  }

  // Filter posts by university ID instead of name
  const posts = await prisma.uCASPost.findMany({
    where: {
      universities: {
        has: university.id
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
        courses={university.courses}
        stats={university.stats}
        posts={posts}
      />
    </div>
  );
}