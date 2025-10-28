// File: app/admin/olympiads/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OlympiadList from "@/app/(admin)/admin/olympiads/olympiad-list";

export default async function OlympiadManagementPage() {

    // Fetch all olympiads with counts
    const olympiads = await prisma.olympiad.findMany({
        include: {
            _count: {
                select: {
                    resources: true,
                },
            },
        },
        orderBy: [
            { title: 'asc' },
        ],
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Olympiad Management</h1>
            </div>

            <div className="mb-6">
                <Link
                    href="/admin/olympiads/new"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Olympiad
                </Link>
            </div>

            <div className="bg-card shadow-md rounded-lg p-6">
                <OlympiadList olympiads={olympiads} />
            </div>
        </div>
    );
}