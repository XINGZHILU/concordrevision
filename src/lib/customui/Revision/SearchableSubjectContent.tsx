'use client';

import { useState, useMemo, useCallback } from 'react';
import { TestCard } from '@/lib/customui/Basic/cards';
import { EditableNoteCard } from '@/lib/customui/Basic/EditableNoteCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuFolder, LuBookCheck, LuBook, LuSearch, LuX, LuInfo } from "react-icons/lu";
import MDViewer from "@/lib/customui/Basic/showMD";
import SubscriptionManager from "@/lib/customui/Revision/SubscriptionManager";
import { Button } from '@/lib/components/ui/button';
import { cn } from '@/lib/utils';
import { Colour, ColourLink, Note as PrismaNote, Test as PrismaTest, Subject as PrismaSubject } from '@prisma/client';

type NoteWithAuthor = PrismaNote & { author: { id: string; firstname: string | null; lastname: string | null; } };

const colorMapping: { [key in Colour]: { className: string } } = {
    Unclassified: { className: "bg-muted text-muted-foreground" },
    Green: { className: "bg-success/20 text-success" },
    Amber: { className: "bg-warning/20 text-warning" },
    Red: { className: "bg-destructive/20 text-destructive" },
};

/**
 * Client component that displays subject details with tabs for About, Tests, and Resources
 * Provides search and filtering capabilities for resources and tests
 */
const SearchableSubjectContent = ({ 
    subject, 
    notes, 
    tests, 
    userColours, 
    yearGroupName,
    currentUserId,
    isTeacherOrAdmin = false
}: { 
    subject: PrismaSubject; 
    notes: NoteWithAuthor[]; 
    tests: PrismaTest[]; 
    userColours?: ColourLink[]; 
    yearGroupName: string; 
    currentUserId?: string;
    isTeacherOrAdmin?: boolean;
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedColor, setSelectedColor] = useState<Colour | 'all'>('all');
    const [activeTab, setActiveTab] = useState('about');

    /**
     * Get user's color preference for a specific note
     */
    const getUserColor = useCallback((noteId: number): Colour => {
        const link = userColours?.find(link => link.noteId === noteId);
        return link ? link.colour : "Unclassified";
    }, [userColours]);

    /**
     * Filter notes based on search query
     */
    const filterNotes = (notes: NoteWithAuthor[], query: string): NoteWithAuthor[] => {
        if (!query.trim()) return notes;
        return notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.desc.toLowerCase().includes(query.toLowerCase())
        );
    };

    /**
     * Filter tests based on search query
     */
    const filterTests = (tests: PrismaTest[], query: string): PrismaTest[] => {
        if (!query.trim()) return tests;
        return tests.filter(test => 
            test.title.toLowerCase().includes(query.toLowerCase()) ||
            test.desc.toLowerCase().includes(query.toLowerCase()) ||
            test.topics.some(topic => 
                topic.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    /**
     * Get filtered resources based on search query and color filter
     */
    const filteredResources = useMemo(() => {
        const approvedNotes = notes.filter(note => note.type === 2 && note.approved);
        const searchedNotes = filterNotes(approvedNotes, searchQuery);

        if (selectedColor === 'all') {
            return searchedNotes;
        }

        return searchedNotes.filter(note => getUserColor(note.id) === selectedColor);

    }, [notes, searchQuery, selectedColor, getUserColor]);

    /**
     * Separate tests into upcoming and past tests
     * Upcoming tests: sorted in ascending order (soonest first)
     * Past tests: sorted in descending order (most recent first)
     * For students: only show past tests from the last 730 days (2 years)
     * For teachers/admins: show all past tests
     */
    const { upcomingTests, pastTests } = useMemo(() => {
        const today = new Date();
        const todayTime = today.getTime();
        // Calculate 730 days ago in milliseconds (730 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        const twoYearsAgoTime = todayTime - (730 * 86400000);
        
        const upcoming: PrismaTest[] = [];
        const past: PrismaTest[] = [];

        tests.forEach(test => {
            const testDate = new Date(test.date).getTime();

            if ((testDate - todayTime) >= (-86400000)) {
                upcoming.push(test);
            } else {
                // For students: only include tests from the past 730 days
                // For teachers/admins: include all past tests
                if (isTeacherOrAdmin || testDate >= twoYearsAgoTime) {
                    past.push(test);
                }
            }
        });
        
        // Sort upcoming tests in ascending order (soonest first)
        upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Sort past tests in descending order (most recent first)
        past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return {
            upcomingTests: filterTests(upcoming, searchQuery),
            pastTests: filterTests(past, searchQuery)
        };
    }, [tests, searchQuery, isTeacherOrAdmin]);

    /**
     * Calculate total tests count
     */
    const totalTests = upcomingTests.length + pastTests.length;

    /**
     * Clear search query
     */
    const clearSearch = () => {
        setSearchQuery('');
    };

    /**
     * Render resource cards with empty state handling
     */
    const renderResourceCards = (resources: NoteWithAuthor[]) => {
        if (resources.length === 0) {
            return searchQuery ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No resources found for &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No resources available yet</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((note) => (
                    <EditableNoteCard
                        key={note.id}
                        note={note}
                        canEdit={currentUserId === note.author.id}
                    />
                ))}
            </div>
        );
    };

    /**
     * Render test cards with empty state handling
     */
    const renderTestCards = (testList: PrismaTest[], isUpcoming: boolean) => {
        if (testList.length === 0) {
            return searchQuery ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No tests found for &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No {isUpcoming ? 'upcoming' : 'past'} tests available
                    </p>
                </div>
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
            <div className="flex items-center gap-4 mb-6">
                <h1 className="flex-grow">{yearGroupName} {subject.title}</h1>
                <SubscriptionManager subjectId={subject.id} userId={currentUserId} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="about" className="flex items-center gap-2">
                        <LuInfo className="h-4 w-4" />
                        About
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="flex items-center gap-2">
                        <LuBook className="h-4 w-4" />
                        Tests
                        {totalTests > 0 && (
                            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                {totalTests}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center gap-2">
                        <LuFolder className="h-4 w-4" />
                        Resources
                        {filteredResources.length > 0 && (
                            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                {filteredResources.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="mt-0">
                    <div className="prose dark:prose-invert max-w-none">
                        <MDViewer content={subject.desc} />
                    </div>
                </TabsContent>

                {/* Tests Tab */}
                <TabsContent value="tests" className="mt-0">
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
                                placeholder="Search tests..."
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

                    {/* Upcoming Tests */}
                    <div className="mb-8">
                        <h2 className="flex items-center mb-4">
                            <LuBook className="h-5 w-5 mr-2" />
                            Upcoming Tests
                            {upcomingTests.length > 0 && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {upcomingTests.length}
                                </span>
                            )}
                        </h2>
                        {renderTestCards(upcomingTests, true)}
                    </div>

                    {/* Past Tests */}
                    <div>
                        <h2 className="flex items-center mb-4">
                            <LuBookCheck className="h-5 w-5 mr-2" />
                            Past Tests
                            {pastTests.length > 0 && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {pastTests.length}
                                </span>
                            )}
                        </h2>
                        {renderTestCards(pastTests, false)}
                    </div>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="mt-0">
                    {/* Search and Filter Bar */}
                    <div className="mb-6 space-y-4">
                        <div className="relative max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LuSearch className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search resources..."
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

                        {/* Color Filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-muted-foreground mr-2">Filter by status:</span>
                            <Button
                                variant={selectedColor === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedColor('all')}
                            >
                                All
                            </Button>
                            {(Object.keys(colorMapping) as Colour[]).map((key) => (
                                <Button
                                    key={key}
                                    variant={selectedColor === key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedColor(key)}
                                    className={cn(
                                        "capitalize",
                                        selectedColor === key && colorMapping[key].className
                                    )}
                                >
                                    {key}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Resources Grid */}
                    {renderResourceCards(filteredResources)}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SearchableSubjectContent; 