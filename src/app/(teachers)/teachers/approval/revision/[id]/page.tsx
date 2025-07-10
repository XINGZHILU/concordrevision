// File: app/admin/approval/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { year_group_names } from "@/lib/consts";
import NoteReviewActions from "./note-review-actions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import FileList from "@/lib/customui/Basic/filelist";
import MDViewer from "@/lib/customui/Basic/showMD";

// Function to get type label
/* 
const getNoteTypeLabel = (type: number) => {
    switch (type) {
        case 0:
            return "Internal Exam Note";
        case 1:
            return "External Exam";
        case 2:
            return "Resource";
        default:
            return "Unknown";
    }
};
*/

export default async function NoteReviewPage({ params }: { params: { id: string } }) {

    const noteId = params.id;

    if (!noteId) {
        notFound();
    }

    // Fetch note with details
    const note = await prisma.note.findUnique({
        where: {
            id: parseInt(noteId),
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
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            },
            files: true,
        },
    });

    if (!note) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link
                        href="/teachers/approval"
                        className="text-primary hover:text-primary/80 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Back to Approval Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">Review Note: {note.title}</h1>
                </div>

                <NoteReviewActions noteId={note.id} />
            </div>

            <div className="bg-card shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">{note.title}</h2>
                            <p className="text-muted-foreground">
                                Subject: {note.subject.title} ({year_group_names[note.subject.level]})
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                            <Badge
                                variant={note.type === 2 ? 'default' : 'secondary'}
                                className="mb-2"
                            >
                                Revision Resource
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                                Submitted by: {`${note.author.firstname} ${note.author.lastname}` || 'Unknown'} ({note.author.email})
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Description:</h3>
                        <div className="bg-muted p-4 rounded border border-border">
                            {note.desc ? (
                                <MDViewer content={note.desc} />
                            ) : (
                                <p className="text-muted-foreground italic">No description provided</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Files ({note.files.length}):</h3>
                        {note.files.length > 0 ? (
                            <div className="bg-muted p-4 rounded border border-border">
                                <FileList files={note.files} />
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">No files attached</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 