// File: app/admin/subjects/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditSubjectForm from "./edit-subject-form";

export default async function EditSubjectPage({ params }: { params: { id: string } }) {

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