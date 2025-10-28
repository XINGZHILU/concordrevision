'use client';

import { useState, useMemo, useCallback } from 'react';
import { TestCard } from '@/lib/customui/Basic/cards';
import { EditableNoteCard } from '@/lib/customui/Basic/EditableNoteCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuFolder, LuBookCheck, LuBook, LuSearch, LuX, LuChevronDown } from "react-icons/lu";
import MDViewer from "@/lib/customui/Basic/showMD";
import SubscriptionManager from "@/lib/customui/Revision/SubscriptionManager";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Colour, ColourLink, Note as PrismaNote, Test as PrismaTest, Subject as PrismaSubject } from '@prisma/client';
import { Collapsible } from "@chakra-ui/react";

type NoteWithAuthor = PrismaNote & { author: { id: string; firstname: string | null; lastname: string | null; } };

const colorMapping: { [key in Colour]: { className: string } } = {
    Unclassified: { className: "bg-muted text-muted-foreground" },
    Green: { className: "bg-success/20 text-success" },
    Amber: { className: "bg-warning/20 text-warning" },
    Red: { className: "bg-destructive/20 text-destructive" },
};

const SearchableSubjectContent = ({ 
    subject, 
    notes, 
    tests, 
    userColours, 
    yearGroupName,
    currentUserId
}: { 
    subject: PrismaSubject; 
    notes: NoteWithAuthor[]; 
    tests: PrismaTest[]; 
    userColours?: ColourLink[]; 
    yearGroupName: string; 
    currentUserId?: string 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedColor, setSelectedColor] = useState<Colour | 'all'>('all');

    const getUserColor = useCallback((noteId: number): Colour => {
        const link = userColours?.find(link => link.noteId === noteId);
        return link ? link.colour : "Unclassified";
    }, [userColours]);

    const filterNotes = (notes: NoteWithAuthor[], query: string): NoteWithAuthor[] => {
        if (!query.trim()) return notes;
        return notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.desc.toLowerCase().includes(query.toLowerCase())
        );
    };

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

    const filteredResources = useMemo(() => {
        const approvedNotes = notes.filter(note => note.type === 2 && note.approved);
        const searchedNotes = filterNotes(approvedNotes, searchQuery);

        if (selectedColor === 'all') {
            return searchedNotes;
        }

        return searchedNotes.filter(note => getUserColor(note.id) === selectedColor);

    }, [notes, searchQuery, selectedColor, getUserColor]);

    const { upcomingTests, pastTests } = useMemo(() => {
        const today = new Date();
        const upcoming: PrismaTest[] = [];
        const past: PrismaTest[] = [];

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

    const clearSearch = () => {
        setSearchQuery('');
    };

    const renderResourceCards = (resources: NoteWithAuthor[]) => {
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

    const renderTestCards = (testList: PrismaTest[]) => {
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

            <Collapsible.Root defaultOpen className="mb-6">
                <Collapsible.Trigger className="flex items-center gap-2 text-2xl font-bold cursor-pointer hover:text-primary transition-colors group">
                    <LuChevronDown className="transition-transform group-data-[state=closed]:rotate-[-90deg]" />
                    About
                </Collapsible.Trigger>
                <Collapsible.Content className="mt-4 ml-6">
                    <MDViewer content={subject.desc} />
                </Collapsible.Content>
            </Collapsible.Root>

            <div className="mb-6 space-y-4">
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

            <div>
                <Tabs defaultValue="resources">
                    <TabsList>
                        <TabsTrigger value="resources">
                            <LuFolder />
                            Resources
                            {searchQuery && filteredResources.length > 0 && (
                                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {filteredResources.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="upcoming_tests">
                            <LuBook />
                            Upcoming tests
                            {searchQuery && upcomingTests.length > 0 && (
                                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {upcomingTests.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="past_tests">
                            <LuBookCheck />
                            Past tests
                            {searchQuery && pastTests.length > 0 && (
                                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {pastTests.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="resources">
                        <div className="mt-4">
                            {renderResourceCards(filteredResources)}
                        </div>
                    </TabsContent>

                    <TabsContent value="upcoming_tests">
                        <div className="mt-4">
                            {renderTestCards(upcomingTests)}
                        </div>
                    </TabsContent>

                    <TabsContent value="past_tests">
                        <div className="mt-4">
                            {renderTestCards(pastTests)}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SearchableSubjectContent; 