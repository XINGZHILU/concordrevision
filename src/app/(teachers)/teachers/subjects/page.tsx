// File: app/teachers/subjects/page.tsx

import { prisma } from "@/lib/prisma";
import SubjectList from "./subject-list";
import { getVisibleYearGroups } from "@/lib/year-group-config";

export default async function SubjectManagementPage() {
    // Get visible year group levels
    const visibleYearGroups = getVisibleYearGroups();
    const visibleLevels = visibleYearGroups.map(group => group.level);

    // Fetch subjects that belong to visible year groups only
    const subjects = await prisma.subject.findMany({
        where: {
            level: {
                in: visibleLevels,
            },
        },
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

