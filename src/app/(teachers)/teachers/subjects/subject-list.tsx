'use client';

// File: app/teachers/subjects/subject-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/lib/components/ui/badge';
import { year_group_names } from "@/lib/consts";
import { getVisibleYearGroups } from "@/lib/year-group-config";

// Define subject type with notes count
type SubjectWithCount = {
    id: number;
    title: string;
    desc: string;
    level: number;
    _count: {
        notes: number;
    };
};

interface SubjectListProps {
    subjects: SubjectWithCount[];
}

export default function SubjectList({ subjects }: SubjectListProps) {
    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');

    // Get visible year groups for filtering
    const visibleYearGroups = useMemo(() => getVisibleYearGroups(), []);
    
    // Get unique levels for filtering (only from subjects that are already filtered by visible year groups)
    const uniqueLevels = useMemo(() => {
        const levels = new Set<number>();
        subjects.forEach(subject => levels.add(subject.level));
        return Array.from(levels).sort((a, b) => a - b);
    }, [subjects]);

    // Filter subjects based on search and level
    const filteredSubjects = useMemo(() => {
        return subjects.filter(subject => {
            const matchesSearch = subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                subject.desc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevel === 'all' || subject.level === selectedLevel;
            return matchesSearch && matchesLevel;
        });
    }, [subjects, searchTerm, selectedLevel]);

    return (
        <div>
            {/* Search and Filter */}
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
                            Search Subjects
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="levelFilter" className="block text-sm font-medium text-foreground mb-1">
                            Year Group
                        </label>
                        <select
                            id="levelFilter"
                            value={selectedLevel.toString()}
                            onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Year Groups</option>
                            {uniqueLevels.map((level) => (
                                <option key={level} value={level}>
                                    {year_group_names[level]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Subjects Count */}
            <h2 className="text-lg font-semibold mb-4">
                Subjects ({filteredSubjects.length})
                {filteredSubjects.length !== subjects.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Filtered from {subjects.length} total)
                    </span>
                )}
            </h2>

            {/* Subjects List */}
            {filteredSubjects.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {subjects.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No subjects found</h3>
                            <p className="mt-1 text-muted-foreground">Get started by adding your first subject.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No matching subjects</h3>
                            <p className="mt-1 text-muted-foreground">Try adjusting your search or filter criteria.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Year Group
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Notes Count
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredSubjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-accent">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-foreground">{subject.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="secondary">
                                            {year_group_names[subject.level]}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-muted-foreground line-clamp-2">{subject.desc}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {subject._count.notes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/teachers/subjects/${subject.id}`}
                                                className="text-primary hover:text-primary/80"
                                            >
                                                Edit
                                            </Link>
                                        </div>
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

