// File: app/admin/approval/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FilteredNoteList from "./filtered-note-list";

export default async function AdminApprovalPage() {
    // Check if user is authenticated
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Fetch unapproved notes
    const unapprovedNotes = await prisma.note.findMany({
        where: {
            approved: false,
        },
        include: {
            subject: {
                select: {
                    id: true,
                    title: true,
                    level: true,
                },
            },
            author: {
                select: {
                    name: true,
                    email: true,
                },
            },
            files: true,
        },
        orderBy: {
            id: 'desc',
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Note Approval Dashboard</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                {/* Pass the notes to the client component for filtering */}
                <FilteredNoteList notes={unapprovedNotes} />
            </div>
        </div>
    );
}