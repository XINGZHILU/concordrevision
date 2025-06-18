'use client';

import Link from "next/link";
import React from "react";
import { Badge } from "@chakra-ui/react";
import { LuPencil, LuUser } from "react-icons/lu";
import { BadgeSymbol } from "./cards";

interface EditableNoteCardProps {
    note: {
        id: number;
        title: string;
        desc: string;
        subjectId: number;
        author: {
            id: string;
            firstname: string | null;
            lastname: string | null;
        };
    };
    colour: number;
    canEdit: boolean;
}

/**
 * Enhanced NoteCard component that shows an edit button for the author
 * Supports editing permissions based on the current user
 */
export function EditableNoteCard({ note, colour, canEdit }: EditableNoteCardProps) {
    const authorName = note.author.firstname && note.author.lastname 
        ? `${note.author.firstname} ${note.author.lastname}`
        : note.author.firstname || note.author.lastname || 'Unknown Author';

    return (
        <div className="relative group w-full bg-white border-gray-200 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Main content - clickable link */}
            <Link href={`/revision/${note.subjectId}/resources/${note.id}`} className="block p-8">
                <h5 className="mb-3 text-xl font-bold tracking-tight text-gray-900 leading-relaxed">{note.title}</h5>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{note.desc || "No description available"}</p>
                <div className="flex items-center justify-between">
                    <BadgeSymbol colour={colour} />
                    <div className="flex items-center text-xs text-gray-500">
                        <LuUser className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-32">{authorName}</span>
                    </div>
                </div>
            </Link>

            {/* Edit button - only visible for the author */}
            {canEdit && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link 
                        href={`/upload/revision/${note.subjectId}/resources/${note.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-colors duration-200"
                        title="Edit this resource"
                        onClick={(e) => e.stopPropagation()} // Prevent the main link from being triggered
                    >
                        <LuPencil className="h-4 w-4" />
                    </Link>
                </div>
            )}

            {/* Author indicator for own content */}
            {canEdit && (
                <div className="absolute top-2 left-2">
                    <Badge colorPalette="blue" size="xs">
                        Your resource
                    </Badge>
                </div>
            )}
        </div>
    );
} 