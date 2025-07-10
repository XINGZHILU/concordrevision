import { prisma } from "@/lib/prisma";
import AddCourseForm from "./add-course-form";
import Link from "next/link";

export default async function AddCoursePage() {
    const universities = await prisma.university.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add New Course</h1>
                <Link href="/admin/ucas" className="text-primary hover:underline">
                    &larr; Back to UCAS Admin
                </Link>
            </div>
            <div className="max-w-3xl mx-auto">
                <AddCourseForm universities={universities} />
            </div>
        </div>
    );
} 