import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import { UCASSubjectList } from '@/lib/customui/UCAS/UCASSubjectList';

/**
 * Page displaying all UCAS subjects (university degree subjects)
 */
export default async function UCASSubjectsPage() {
  const ucasSubjects = await prisma.uCASSubject.findMany({
    include: {
      courses: {
        select: {
          universityId: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Get all universities that offer courses
  const universities = await prisma.university.findMany({
    where: {
      courses: {
        some: {}
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className='w-11/12 mx-auto'>
      <h1 className="text-4xl font-bold my-8">UCAS Subjects</h1>
      <Suspense fallback={<p>Loading subjects...</p>}>
        <UCASSubjectList ucasSubjects={ucasSubjects} universities={universities} />
      </Suspense>
    </div>
  )
}

