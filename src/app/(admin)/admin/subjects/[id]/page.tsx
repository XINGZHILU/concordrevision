// File: app/admin/subjects/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import EditSubjectForm from "./edit-subject-form";

export default async function EditSubjectPage({ params }: { params: { id: string } }) {
    // Check if user is authenticated
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const subjectId = parseInt(params.id);

    if (isNaN(subjectId)) {
        notFound();
    }

    // Fetch subject
    const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
            _count: {
                select: { notes: true }
            }
        }
    });

    if (!subject) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <EditSubjectForm subject={subject} />
        </div>
    );
}