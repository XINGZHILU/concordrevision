import { UniversityList } from '@/lib/customui/UCAS/UniversityList';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';

export default async function FinderPage() {
  const universities = await prisma.university.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className='w-11/12 mx-auto'>
      <h1 className="text-4xl font-bold my-8">School & Course Finder</h1>
      <Suspense fallback={<p>Loading universities...</p>}>
        <UniversityList universities={universities} />
      </Suspense>
    </div>
  )
} 