'use client';

// File: app/admin/approval/filtered-note-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@chakra-ui/react";
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
        name: string | null;
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
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Filter Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="yearGroupFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Year Group
                        </label>
                        <select
                            id="yearGroupFilter"
                            value={selectedYearGroup.toString()}
                            onChange={(e) => setSelectedYearGroup(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                        <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <select
                            id="subjectFilter"
                            value={selectedSubject.toString()}
                            onChange={(e) => setSelectedSubject(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                    <span className="text-sm font-normal text-gray-500 ml-2">
            (Filtered from {notes.length} total)
          </span>
                )}
            </h2>

            {filteredNotes.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {notes.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">All caught up!</h3>
                            <p className="mt-1 text-gray-500">No notes are pending approval at this time.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No matching notes</h3>
                            <p className="mt-1 text-gray-500">Try changing your filters to see more notes.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subject
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Files
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredNotes.map((note) => (
                            <tr key={note.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{note.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{note.desc.substring(0, 50)}{note.desc.length > 50 ? '...' : ''}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{note.subject.title}</div>
                                    <div className="text-xs text-gray-500">{year_group_names[note.subject.level]}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{note.author.name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{note.author.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge
                                        colorPalette={note.type === 0 ? 'green' : note.type === 1 ? 'orange' : 'blue'}
                                    >
                                        {getNoteTypeLabel(note.type)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {note.files.length} file{note.files.length !== 1 ? 's' : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        href={`/admin/approval/${note.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded border border-indigo-600 hover:bg-indigo-50"
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