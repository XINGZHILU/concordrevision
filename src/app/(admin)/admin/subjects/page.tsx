// File: app/admin/subjects/page.tsx

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubjectList from "./subject-list";

export default async function SubjectManagementPage() {
    // Check if user is authenticated
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

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
                <Link
                    href="/admin"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>


            <div className="bg-white shadow-md rounded-lg p-6">
                <SubjectList subjects={subjects} />
            </div>
        </div>
    );
}