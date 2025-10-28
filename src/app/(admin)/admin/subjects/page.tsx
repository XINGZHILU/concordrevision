// File: app/admin/subjects/page.tsx

import { prisma } from "@/lib/prisma";
import SubjectList from "@/app/(admin)/admin/subjects/subject-list";

export default async function SubjectManagementPage() {

    // Fetch all subjects with notes count
    const subjects = await prisma.subject.findMany({
        include: {
            _count: {
                select: {
                    notes: true,
                },
            },
        },
        orderBy: [
            { level: 'asc' },
            { title: 'asc' },
        ],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Subject Management</h1>
            </div>


            <div className="bg-card shadow-md rounded-lg p-6">
                <SubjectList subjects={subjects} />
            </div>
        </div>
    );
}