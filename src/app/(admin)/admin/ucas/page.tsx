import { UniversityManager } from "./UniversityManager";
import { CourseManager } from "./CourseManager";
import { prisma } from "@/lib/prisma";

export default async function UcasAdminPage() {
    const universities = await prisma.university.findMany({
        include: {
            courseLinks: {
                include: {
                    course: true
                }
            }
        }
    });

    const courses = await prisma.course.findMany();

    return (
        <div className="w-11/12 mx-auto">
            <h1 className="text-4xl font-bold my-8">UCAS Management</h1>
            <div className="space-y-12">
                <UniversityManager universities={universities} courses={courses} />
                <CourseManager courses={courses} />
            </div>
        </div>
    );
}