import { UniversityManager } from "@/app/(admin)/admin/ucas/UniversityManager";
import { UCASSubjectManager } from "@/app/(admin)/admin/ucas/UCASSubjectManager";
import { prisma } from "@/lib/prisma";

/**
 * Admin page for managing UCAS data (universities and UCAS subjects)
 */

export default async function UcasAdminPage() {
    const universities = await prisma.university.findMany({
        include: {
            courses: {
                include: {
                    ucasSubject: true
                }
            }
        },
        orderBy: {
          name: 'asc'
        }
    });

    const ucasSubjects = await prisma.uCASSubject.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return (
        <div className="w-11/12 mx-auto">
            <h1 className="text-4xl font-bold my-8">UCAS Management</h1>
            <div className="space-y-12">
                <UniversityManager universities={universities} ucasSubjects={ucasSubjects} />
                <UCASSubjectManager ucasSubjects={ucasSubjects} />
            </div>
        </div>
    );
}