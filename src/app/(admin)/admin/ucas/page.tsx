import { prisma } from "@/lib/prisma";
import UniversityList from "./university-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function UcasAdminPage() {
    const universities = await prisma.university.findMany({
        orderBy: {
            name: 'asc'
        },
        include: {
            courses: true
        }
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Universities and Courses</h1>
                <div className="flex space-x-4">
                    <Button asChild>
                        <Link href="/admin/ucas/universities/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add University
                        </Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/admin/ucas/courses/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Course
                        </Link>
                    </Button>
                </div>
            </div>

            <UniversityList universities={universities} />
        </div>
    );
} 