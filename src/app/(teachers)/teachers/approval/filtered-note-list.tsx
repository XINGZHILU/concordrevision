'use client';

// File: app/admin/approval/filtered-note-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { year_group_names } from "@/lib/consts";

// Define types for our data
type NoteWithSubject = {
    id: number;
    title: string;
    desc: string;
    authorId: string;
    approved: boolean;
    type: number;
    createdAt?: Date;
    subject: {
        id: number;
        title: string;
        level: number;
    };
    author: {
        firstname: string | null;
        lastname: string | null;
        email: string;
    };
    files: {
        id: number;
        filename: string;
        path: string;
    }[];
};

// Define unique subjects type
type UniqueSubject = {
    id: number;
    title: string;
};

interface FilteredNoteListProps {
    notes: NoteWithSubject[];
}

export default function FilteredNoteList({ notes }: FilteredNoteListProps) {
    // State for filters
    const [selectedYearGroup, setSelectedYearGroup] = useState<number | 'all'>('all');
    const [selectedSubject, setSelectedSubject] = useState<number | 'all'>('all');

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

    // Extract unique year groups and subjects from the notes
    const uniqueYearGroups = useMemo(() => {
        const yearGroups = new Set<number>();
        notes.forEach(note => yearGroups.add(note.subject.level));
        return Array.from(yearGroups).sort((a, b) => a - b);
    }, [notes]);

    const uniqueSubjects = useMemo(() => {
        const subjects = new Map<number, UniqueSubject>();
        notes.forEach(note => {
            if (!subjects.has(note.subject.id)) {
                subjects.set(note.subject.id, {
                    id: note.subject.id,
                    title: note.subject.title
                });
            }
        });
        return Array.from(subjects.values()).sort((a, b) => a.title.localeCompare(b.title));
    }, [notes]);

    // Filter notes based on selected filters
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesYearGroup = selectedYearGroup === 'all' || note.subject.level === selectedYearGroup;
            const matchesSubject = selectedSubject === 'all' || note.subject.id === selectedSubject;
            return matchesYearGroup && matchesSubject;
        });
    }, [notes, selectedYearGroup, selectedSubject]);

    return (
        <div>
            {/* Filter controls */}
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                <h3 className="font-medium text-foreground mb-3">Filter Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="yearGroupFilter" className="block text-sm font-medium text-foreground mb-1">
                            Year Group
                        </label>
                        <select
                            id="yearGroupFilter"
                            value={selectedYearGroup.toString()}
                            onChange={(e) => setSelectedYearGroup(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Year Groups</option>
                            {uniqueYearGroups.map((level) => (
                                <option key={level} value={level}>
                                    {year_group_names[level]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subjectFilter" className="block text-sm font-medium text-foreground mb-1">
                            Subject
                        </label>
                        <select
                            id="subjectFilter"
                            value={selectedSubject.toString()}
                            onChange={(e) => setSelectedSubject(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Subjects</option>
                            {uniqueSubjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Notes list */}
            <h2 className="text-lg font-semibold mb-4">
                Pending Approvals ({filteredNotes.length})
                {filteredNotes.length !== notes.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Filtered from {notes.length} total)
                    </span>
                )}
            </h2>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {notes.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">All caught up!</h3>
                            <p className="mt-1 text-muted-foreground">No notes are pending approval at this time.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No matching notes</h3>
                            <p className="mt-1 text-muted-foreground">Try changing your filters to see more notes.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-card shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Subject
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Files
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredNotes.map((note) => (
                                <tr key={note.id} className="hover:bg-accent">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground">{note.title}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-xs">{note.desc.substring(0, 50)}{note.desc.length > 50 ? '...' : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{note.subject.title}</div>
                                        <div className="text-xs text-muted-foreground">{year_group_names[note.subject.level]}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{`${note.author.firstname} ${note.author.lastname}` || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{note.author.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            variant={note.type === 2 ? 'default' : 'secondary'}
                                        >
                                            {getNoteTypeLabel(note.type)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {note.files.length} file{note.files.length !== 1 ? 's' : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/teachers/approval/revision/${note.id}`}
                                            className="text-primary hover:text-primary/80 px-3 py-1 rounded border border-primary hover:bg-primary/10"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 