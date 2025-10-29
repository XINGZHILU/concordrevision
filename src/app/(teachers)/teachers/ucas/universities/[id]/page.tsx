import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UniversityTeacherTabs } from './university-teacher-tabs';

export default async function UniversityTeacherPage({
  params,
}: {
  params: { id: string };
}) {
  const university = await prisma.university.findUnique({
    where: { id: await params.id },
    include: {
      stats: true,
      courses: {
        include: {
          ucasSubject: true
        },
        orderBy: {
          name: 'asc'
        }
      }
    },
  });

  if (!university) {
    notFound();
  }

  const ucasSubjects = await prisma.uCASSubject.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage {university.name}</h1>
      <UniversityTeacherTabs 
        university={university}
        ucasSubjects={ucasSubjects}
      />
    </div>
  );
}

