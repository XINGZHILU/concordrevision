import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SearchableUCASSubjectContent from '@/lib/customui/UCAS/SearchableUCASSubjectContent';

/**
 * Page displaying a specific UCAS subject with its courses at different universities
 */
export default async function UCASSubjectPage({ params }: { params: { cid: string } }) {
  const page_params = await params;
  const ucasSubject = await prisma.uCASSubject.findUnique({
    where: {
      id: page_params.cid
    },
    include: {
      courses: {
        include: {
          university: true
        }
      }
    }
  });

  if (!ucasSubject) {
    notFound();
  }

  // Filter posts by UCAS subject ID instead of name
  const posts = await prisma.uCASPost.findMany({
    where: {
      ucasSubjects: {
        has: ucasSubject.id
      }
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto py-8">
      <SearchableUCASSubjectContent 
        ucasSubject={ucasSubject}
        courses={ucasSubject.courses}
        posts={posts}
      />
    </div>
  );
}

