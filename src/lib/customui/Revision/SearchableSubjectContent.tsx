'use client';

import { useState, useMemo } from 'react';
import { TestCard } from '@/lib/customui/Basic/cards';
import { EditableNoteCard } from '@/lib/customui/Basic/EditableNoteCard';
import { Collapsible, Tabs } from "@chakra-ui/react";
import { LuFolder, LuBookCheck, LuBook, LuSearch, LuX } from "react-icons/lu";
import MDViewer from "@/lib/customui/Basic/showMD";
import SubscriptionManager from "./SubscriptionManager";

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
    uploadedAt: Date;
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
        const filtered = query.trim() 
            ? notes.filter(note => 
                note.title.toLowerCase().includes(query.toLowerCase()) ||
                note.desc.toLowerCase().includes(query.toLowerCase())
              )
            : notes;

        return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    };

    /**
     * Filter tests based on search query
     */
    const filterTests = (tests: Test[], query: string): Test[] => {
        const filtered = query.trim()
            ? tests.filter(test => 
                test.title.toLowerCase().includes(query.toLowerCase()) ||
                test.desc.toLowerCase().includes(query.toLowerCase()) ||
                test.topics.some(topic => 
                    topic.toLowerCase().includes(query.toLowerCase())
                )
              )
            : tests;
        
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Filter resources (notes)
    const filteredResources = useMemo(() => {
        const approvedNotes = notes.filter(note => note.type === 2 && note.approved);
        return filterNotes(approvedNotes, searchQuery);
    }, [notes, searchQuery]);

    // Separate tests into upcoming and past
    const { upcomingTests, pastTests } = useMemo(() => {
        const today = new Date();
        const upcoming: Test[] = [];
        const past: Test[] = [];

        tests.forEach(test => {
            const testDate = new Date(test.date).getTime();
            const todayTime = today.getTime();

            if ((testDate - todayTime) >= (-86400000)) {
                upcoming.push(test);
            } else {
                past.push(test);
            }
        });
        
        return {
            upcomingTests: filterTests(upcoming, searchQuery),
            pastTests: filterTests(past, searchQuery)
        };
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
                    <p className="text-muted-foreground">No resources found for &quot;{searchQuery}&quot;</p>
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
                    <p className="text-muted-foreground">No tests found for &quot;{searchQuery}&quot;</p>
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
            <div className="flex items-center gap-4 mb-4">
                <h1 className="flex-grow">{yearGroupName} {subject.title}</h1>
                <SubscriptionManager subjectId={subject.id} userId={currentUserId} />
            </div>

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
                        <LuSearch className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resources and tests..."
                        className="block w-full pl-9 pr-8 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <LuX className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-muted-foreground">
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
                                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {filteredResources.length}
                                </span>
                            )}
                        </Tabs.Trigger>
                        <Tabs.Trigger value="upcoming_tests" p="2">
                            <LuBook />
                            Upcoming tests
                            {searchQuery && upcomingTests.length > 0 && (
                                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {upcomingTests.length}
                                </span>
                            )}
                        </Tabs.Trigger>
                        <Tabs.Trigger value="past_tests" p="2">
                            <LuBookCheck />
                            Past tests
                            {searchQuery && pastTests.length > 0 && (
                                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
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