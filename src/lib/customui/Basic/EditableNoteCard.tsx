'use client';

import { Note, Colour } from "@prisma/client";
import Link from 'next/link';
import { LuCircleCheck, LuCircleEllipsis, LuCircleAlert, LuCircleHelp, LuPencil } from "react-icons/lu";
import { cva } from 'class-variance-authority';

const cardVariants = cva(
    "relative group w-full bg-card border-border border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
    {
        variants: {
            color: {
                unclassified: "bg-card border-border border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
                green: "bg-success/20 border-success/40 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
                amber: "bg-warning/20 border-warning/40 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
                red: "bg-destructive/20 border-destructive/40 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
            },
        },
        defaultVariants: {
            color: "unclassified",
        },
    }
);

interface NoteCardProps {
    note: Note & {
        author: {
            id: string;
            firstname: string | null;
            lastname: string | null;
        }
    };
    canEdit: boolean;
}

function GetSymbol({ colour }: { colour: Colour }) {
    if (colour === "Green") return <LuCircleCheck className="h-4 w-4 text-success" />;
    if (colour === "Amber") return <LuCircleEllipsis className="h-4 w-4 text-warning" />;
    if (colour === "Red") return <LuCircleAlert className="h-4 w-4 text-destructive" />;
    return <LuCircleHelp className="h-4 w-4 text-muted-foreground" />;
}

/**
 * Enhanced NoteCard component that shows an edit button for the author
 * Supports editing permissions based on the current user
 */
export function EditableNoteCard({ note, canEdit }: NoteCardProps) {
    const authorName = note.author.firstname && note.author.lastname
        ? `${note.author.firstname} ${note.author.lastname}`
        : note.author.firstname || note.author.lastname || 'Unknown Author';

    return (
        <div className={cardVariants({ color: "unclassified" })}>
            {/* Main content - clickable link */}
            <Link href={`/revision/${note.subjectId}/resources/${note.id}`} className="block p-8">
                <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            </Link>

            {/* Footer with author and color status */}
            <div className="border-t border-border px-8 py-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                    <GetSymbol colour={"Green"} />
                    <span className="ml-1.5">Completed</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="truncate max-w-32">{authorName}</span>
                    {canEdit && (
                        <Link href={`/upload/revision/${note.subjectId}/edit`} className="text-primary hover:underline flex items-center">
                            <LuPencil className="h-3 w-3 mr-1" />
                            Edit
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
} 