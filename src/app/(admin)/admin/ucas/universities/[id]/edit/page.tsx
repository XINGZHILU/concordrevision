import { prisma } from "@/lib/prisma";
import EditUniversityForm from "./edit-university-form";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditUniversityPage({ params }: { params: { id: string } }) {
    const university = await prisma.university.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!university) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit University</h1>
                <Link href="/admin/ucas" className="text-primary hover:underline">
                    &larr; Back to UCAS Admin
                </Link>
            </div>
            <div className="max-w-xl mx-auto">
                <EditUniversityForm university={university} />
            </div>
        </div>
    );
} 