import { prisma } from "@/lib/prisma";
import { TeacherNoteList } from "../../note-list";
import { Note } from "@prisma/client";

export default async function TeacherDeleteRevisionPage({ params }: { params: { subjectId: string } }) {
    const page_params = await params;
    const subject = await prisma.subject.findUnique({
        where: { id: parseInt(page_params.subjectId) },
    });
    const notes = await prisma.note.findMany({
        where: { subjectId: parseInt(page_params.subjectId) },
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
            <TeacherNoteList notes={notes as (Note & { author: { id: string, firstname: string | null, lastname: string | null } })[]} />
        </div>
    );
}

