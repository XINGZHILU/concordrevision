import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { EditCourseForm } from './edit-course-form';

/**
 * Page for editing a specific course
 * Only accessible by teachers and admins
 */
export default async function EditCoursePage({ params }: { params: { id: string } }) {
    const user = await currentUser();

    if (!user) {
        notFound();
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || (!dbUser.teacher && !dbUser.admin)) {
        notFound();
    }

    const course = await prisma.course.findUnique({
        where: { id: parseInt((await params).id, 10) },
        include: {
            university: true,
            ucasSubject: true
        }
    });

    if (!course) {
        notFound();
    }

    const ucasSubjects = await prisma.uCASSubject.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">
                Edit Course: {course.name}
            </h1>
            <p className="text-muted-foreground mb-6">
                {course.university.name} - {course.ucasSubject.name}
            </p>
            <EditCourseForm 
                course={course}
                ucasSubjects={ucasSubjects}
            />
        </div>
    );
}

