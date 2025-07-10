import { prisma } from "@/lib/prisma";
import EditCourseForm from "./edit-course-form";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
    const course = await prisma.ucasCourse.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!course) {
        notFound();
    }

    const universities = await prisma.university.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Course</h1>
                <Link href="/admin/ucas" className="text-primary hover:underline">
                    &larr; Back to UCAS Admin
                </Link>
            </div>
            <div className="max-w-3xl mx-auto">
                <EditCourseForm course={course} universities={universities} />
            </div>
        </div>
    );
} 