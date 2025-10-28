import { prisma } from "@/lib/prisma";
import { AdminNoteList } from "@/app/(admin)/admin/delete/note-list";
import { Note } from "@prisma/client";

export default async function AdminDeleteRevisionPage({ params }: { params: { subjectId: string } }) {
    const subject = await prisma.subject.findUnique({
        where: { id: parseInt(params.subjectId) },
    });
    const notes = await prisma.note.findMany({
        where: { subjectId: parseInt(params.subjectId) },
        include: {
            author: true,
        },
    });

    if (!subject) {
        return <h1>Subject not found</h1>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Delete Resources for {subject.title}</h1>
            <p className="text-muted-foreground mb-8">
                View and delete revision notes for this subject.
            </p>
            <AdminNoteList notes={notes as (Note & { author: { id: string, firstname: string | null, lastname: string | null } })[]} />
        </div>
    );
} 