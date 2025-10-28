import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AdmissionStatsForm } from '@/app/(admin)/admin/ucas/universities/[id]/admission-stats-form';
import { UniversityDetailsForm } from '@/app/(admin)/admin/ucas/universities/[id]/university-details-form';

export default async function UniversityAdminPage({
  params,
}: {
  params: { id: string };
}) {
  const university = await prisma.university.findUnique({
    where: { id: await params.id },
    include: {
      stats: true,
    },
  });

  if (!university) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage {university.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">University Details</h2>
          <UniversityDetailsForm university={university} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Admission Statistics</h2>
          <AdmissionStatsForm universityId={university.id} stats={university.stats} />
        </div>
      </div>
    </div>
  );
} 