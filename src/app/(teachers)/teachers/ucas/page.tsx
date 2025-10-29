
import { prisma } from "@/lib/prisma";
import { UCASTeacherTabs } from "./UCASTeacherTabs";

/**
 * Teacher dashboard page for managing UCAS data (universities, subjects, and courses)
 */
export default async function UcasTeacherPage() {
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

    const courses = await prisma.course.findMany({
      include: {
        ucasSubject: true,
        university: true
      },
      orderBy: [
        { university: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    return (
        <div className="w-11/12 mx-auto py-8">
            <h1 className="mb-6">UCAS Management</h1>
            <UCASTeacherTabs 
                universities={universities} 
                ucasSubjects={ucasSubjects}
                courses={courses}
            />
        </div>
    );
}

