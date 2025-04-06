// File: app/admin/approval/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { year_group_names } from "@/lib/consts";
import NoteReviewActions from "./note-review-actions";
import Link from "next/link";
import { Badge } from "@chakra-ui/react";
import FileList from "@/lib/customui/Basic/filelist";

// Function to get type label
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
                    name: true,
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
                        href="/src/app/(main)/admin/approval"
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
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

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">{note.title}</h2>
                            <p className="text-gray-500">
                                Subject: {note.subject.title} ({year_group_names[note.subject.level]})
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                            <Badge
                                colorPalette={note.type === 0 ? 'green' : note.type === 1 ? 'orange' : 'blue'}
                                className="mb-2"
                            >
                                {getNoteTypeLabel(note.type)}
                            </Badge>
                            <p className="text-sm text-gray-600">
                                Submitted by: {note.author.name || 'Unknown'} ({note.author.email})
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Description:</h3>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            {note.desc ? (
                                note.desc.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line}</p>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No description provided</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Files ({note.files.length}):</h3>
                        {note.files.length > 0 ? (
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <FileList files={note.files} />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No files attached</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}