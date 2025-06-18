'use client';

import { useState, useMemo } from 'react';
import { TestCard } from '@/lib/customui/Basic/cards';
import { EditableNoteCard } from '@/lib/customui/Basic/EditableNoteCard';
import { Collapsible, Tabs } from "@chakra-ui/react";
import { LuFolder, LuBookCheck, LuBook, LuSearch, LuX } from "react-icons/lu";
import MDViewer from "@/lib/customui/Basic/showMD";

interface Note {
    id: number;
    title: string;
    desc: string;
    subjectId: number;
    type: number;
    approved: boolean;
    pinned: boolean;
    author: {
        id: string;
        firstname: string | null;
        lastname: string | null;
    };
}

interface Test {
    id: number;
    title: string;
    desc: string;
    subjectId: number;
    date: string | Date;
    type: number;
    topics: string[];
}

interface Subject {
    id: number;
    title: string;
    desc: string;
    level: number;
}

interface SearchableSubjectContentProps {
    subject: Subject;
    notes: Note[];
    tests: Test[];
    userColours?: { red: number[]; amber: number[]; green: number[] };
    yearGroupName: string;
    currentUserId?: string;
}

/**
 * Client component that provides search functionality for subject resources
 * Filters resources, upcoming tests, and past tests based on search query
 */
const SearchableSubjectContent = ({ 
    subject, 
    notes, 
    tests, 
    userColours, 
    yearGroupName,
    currentUserId
}: SearchableSubjectContentProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Function to get user's color preference for a note
     */
    const getUserColor = (noteId: number) => {
        if (!userColours) return -1;
        
        if (userColours.red.includes(noteId)) return 2;
        if (userColours.amber.includes(noteId)) return 1;
        if (userColours.green.includes(noteId)) return 0;
        return -1;
    };

    /**
     * Filter notes based on search query
     */
    const filterNotes = (notes: Note[], query: string): Note[] => {
        if (!query.trim()) return notes;
        
        const lowerQuery = query.toLowerCase();
        return notes.filter(note => 
            note.title.toLowerCase().includes(lowerQuery) ||
            note.desc.toLowerCase().includes(lowerQuery)
        );
    };

    /**
     * Filter tests based on search query
     */
    const filterTests = (tests: Test[], query: string): Test[] => {
        if (!query.trim()) return tests;
        
        const lowerQuery = query.toLowerCase();
        return tests.filter(test => 
            test.title.toLowerCase().includes(lowerQuery) ||
            test.desc.toLowerCase().includes(lowerQuery) ||
            test.topics.some(topic => 
                topic.toLowerCase().includes(lowerQuery)
            )
        );
    };

    // Filter resources (notes)
    const filteredResources = useMemo(() => {
        const approvedNotes = notes.filter(note => note.type === 2 && note.approved);
        return filterNotes(approvedNotes, searchQuery);
    }, [notes, searchQuery]);

    // Separate tests into upcoming and past
    const today = new Date();
    const upcomingTests = useMemo(() => {
        const upcoming = tests.filter(test => 
            (new Date(test.date).getTime() - today.getTime()) >= (-86400000)
        );
        return filterTests(upcoming, searchQuery);
    }, [tests, searchQuery]);

    const pastTests = useMemo(() => {
        const past = tests.filter(test => 
            (new Date(test.date).getTime() - today.getTime()) < (-86400000)
        );
        return filterTests(past, searchQuery);
    }, [tests, searchQuery]);

    /**
     * Clear search input
     */
    const clearSearch = () => {
        setSearchQuery('');
    };

    /**
     * Render resource cards
     */
    const renderResourceCards = (resources: Note[]) => {
        if (resources.length === 0) {
            return searchQuery ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No resources found for &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <p>No resources found</p>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((note) => (
                    <EditableNoteCard
                        key={note.id}
                        note={note}
                        colour={getUserColor(note.id)}
                        canEdit={currentUserId === note.author.id}
                    />
                ))}
            </div>
        );
    };

    /**
     * Render test cards
     */
    const renderTestCards = (testList: Test[]) => {
        if (testList.length === 0) {
            return searchQuery ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No tests found for &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <p>No tests found</p>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testList.map((test) => (
                    <TestCard 
                        key={test.id} 
                        test={{
                            ...test,
                            date: typeof test.date === 'string' ? new Date(test.date) : test.date
                        }} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <h1>{yearGroupName} {subject.title}</h1>
            <br />

            <Collapsible.Root defaultOpen>
                <Collapsible.Trigger paddingY="3"><h2>About</h2></Collapsible.Trigger>
                <Collapsible.Content>
                    <MDViewer content={subject.desc} />
                </Collapsible.Content>
            </Collapsible.Root>
            <br />

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LuSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resources and tests..."
                        className="block w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <LuX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-gray-600">
                        Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
                    </p>
                )}
            </div>

            {/* Tabs with filtered content */}
            <div>
                <Tabs.Root defaultValue="resources" variant="plain" rounded="l3">
                    <Tabs.List bg="bg.muted" rounded="l3" p="1">
                        <Tabs.Trigger value="resources" p="2">
                            <LuFolder />
                            Resources
                            {searchQuery && filteredResources.length > 0 && (
                                <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                    {filteredResources.length}
                                </span>
                            )}
                        </Tabs.Trigger>
                        <Tabs.Trigger value="upcoming_tests" p="2">
                            <LuBook />
                            Upcoming tests
                            {searchQuery && upcomingTests.length > 0 && (
                                <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                    {upcomingTests.length}
                                </span>
                            )}
                        </Tabs.Trigger>
                        <Tabs.Trigger value="past_tests" p="2">
                            <LuBookCheck />
                            Past tests
                            {searchQuery && pastTests.length > 0 && (
                                <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                    {pastTests.length}
                                </span>
                            )}
                        </Tabs.Trigger>
                        <Tabs.Indicator rounded="l2" />
                    </Tabs.List>

                    <Tabs.Content value="resources">
                        <div className="mt-4">
                            {renderResourceCards(filteredResources)}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="upcoming_tests">
                        <div className="mt-4">
                            {renderTestCards(upcomingTests)}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="past_tests">
                        <div className="mt-4">
                            {renderTestCards(pastTests)}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
};

export default SearchableSubjectContent; 