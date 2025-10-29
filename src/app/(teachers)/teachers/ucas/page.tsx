import { UniversityManager } from "./UniversityManager";
import { CourseManager } from "./CourseManager";
import { prisma } from "@/lib/prisma";
import { UCASTeacherTabs } from "./UCASTeacherTabs";

export default async function UcasTeacherPage() {
    const universities = await prisma.university.findMany({
        include: {
            courseLinks: {
                include: {
                    course: true
                }
            }
        },
        orderBy: {
          name: 'asc'
        }
    });

    const courses = await prisma.course.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    const courseLinks = await prisma.courseLink.findMany({
      include: {
        course: true,
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
                courses={courses}
                courseLinks={courseLinks}
            />
        </div>
    );
}

