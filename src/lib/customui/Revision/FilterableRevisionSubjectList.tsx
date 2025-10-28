'use client';

import { useState } from 'react';
import { SubjectItem } from '@/lib/customui/Upload/SubjectItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { getVisibleYearGroups, isYearGroupVisible } from "@/lib/year-group-config";
import { LuBookOpen, LuBookPlus, LuBookUp, LuBookKey, LuBookMarked, LuFilter, LuUsers, LuGlobe } from "react-icons/lu";

interface Subject {
    id: number;
    title: string;
    desc: string;
    level: number;
}

interface FilterableRevisionSubjectListProps {
    subjects: Subject[];
    year: number;
    userSubscriptions: number[];
    isAuthenticated: boolean;
}

/**
 * Enhanced revision subject list with subscribed subjects displayed first and highlighted
 * Always shows all subjects, with subscribed ones prioritized
 */
const FilterableRevisionSubjectList = ({ 
    subjects, 
    year, 
    userSubscriptions, 
    isAuthenticated 
}: FilterableRevisionSubjectListProps) => {
    // Filter subjects to only include those from visible year groups
    const visibleSubjects = subjects.filter((subject) => isYearGroupVisible(subject.level));
    
    // Sort subjects: subscribed first, then alphabetically within each group
    const sortedSubjects = [...visibleSubjects].sort((a, b) => {
        const aSubscribed = userSubscriptions.includes(a.id);
        const bSubscribed = userSubscriptions.includes(b.id);
        
        // If subscription status differs, subscribed comes first
        if (aSubscribed !== bSubscribed) {
            return aSubscribed ? -1 : 1;
        }
        
        // Otherwise, sort alphabetically by title
        return a.title.localeCompare(b.title);
    });
    
    // Group subjects by level (already sorted with subscribed first)
    const f3 = sortedSubjects.filter((subject) => subject.level === 0);
    const f4 = sortedSubjects.filter((subject) => subject.level === 1);
    const f5 = sortedSubjects.filter((subject) => subject.level === 2);
    const f61 = sortedSubjects.filter((subject) => subject.level === 3);
    const f62 = sortedSubjects.filter((subject) => subject.level === 4);

    const visibleYearGroups = getVisibleYearGroups();
    const tabIds = ['f3', 'f4', 'f5', '61', '62'];
    const requestedTabId = tabIds[year];
    const isRequestedVisible = visibleYearGroups.some(group => group.tabId === requestedTabId);
    const defaultTab = isRequestedVisible ? requestedTabId : (visibleYearGroups[0]?.tabId || 'f3');

    // Get year group icon
    const getYearGroupIcon = (level: number) => {
        switch (level) {
            case 0: return <LuBookOpen className="w-4 h-4 mr-2" />;
            case 1: return <LuBookPlus className="w-4 h-4 mr-2" />;
            case 2: return <LuBookUp className="w-4 h-4 mr-2" />;
            case 3: return <LuBookKey className="w-4 h-4 mr-2" />;
            case 4: return <LuBookMarked className="w-4 h-4 mr-2" />;
            default: return <LuBookOpen className="w-4 h-4 mr-2" />;
        }
    };

    // Calculate subscription stats
    const totalSubjects = visibleSubjects.length;
    const subscribedCount = userSubscriptions.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Revision Resources</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Access study materials, practice questions, and resources for all subjects
                </p>
            </div>

            {/* Subscription info banner */}
            {isAuthenticated && subscribedCount > 0 && (
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                            <LuUsers className="h-4 w-4 text-primary" />
                            <span className="text-foreground">
                                You have <strong className="text-primary">{subscribedCount}</strong> subscription{subscribedCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                            • Subscribed subjects are highlighted and shown first
                        </span>
                    </div>
                </div>
            )}

            {/* Year group tabs */}
            {visibleYearGroups.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg border border-border">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
                        <LuBookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No year groups available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        No year groups are currently enabled. Please contact an administrator.
                    </p>
                </div>
            ) : (
                <Tabs defaultValue={defaultTab}>
                    <div className="border-b border-border mb-8">
                        <div className="flex justify-center">
                            <TabsList>
                                {visibleYearGroups.map(group => {
                                    const contentMap: { [key: number]: Subject[] } = {
                                        0: f3, 1: f4, 2: f5, 3: f61, 4: f62
                                    };
                                    const groupSubjects = contentMap[group.level] || [];
                                    
                                    return (
                                        <TabsTrigger 
                                            key={group.tabId} 
                                            value={group.tabId} 
                                            className="flex items-center px-3 py-2 text-sm font-medium"
                                        >
                                            {getYearGroupIcon(group.level)}
                                            {group.name}
                                            {groupSubjects.length > 0 && (
                                                <Badge variant="secondary" className="ml-2">
                                                    {groupSubjects.length}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                    </div>

                    {visibleYearGroups.map(group => {
                        const contentMap: { [key: number]: Subject[] } = {
                            0: f3, 1: f4, 2: f5, 3: f61, 4: f62
                        };
                        return (
                            <TabsContent key={group.tabId} value={group.tabId}>
                                <SubjectListContent 
                                    subjects={contentMap[group.level] || []} 
                                    level={group.level}
                                    yearGroupName={group.name}
                                    userSubscriptions={userSubscriptions}
                                    isAuthenticated={isAuthenticated}
                                />
                            </TabsContent>
                        );
                    })}
                </Tabs>
            )}
        </div>
    );
};

// Enhanced subject list content with subscription awareness
// Subscribed subjects are highlighted and displayed first
function SubjectListContent({ 
    subjects, 
    level, 
    yearGroupName, 
    userSubscriptions,
    isAuthenticated
}: {
    subjects: Subject[];
    level: number;
    yearGroupName: string;
    userSubscriptions: number[];
    isAuthenticated: boolean;
}) {
    if (subjects.length === 0) {
        return (
            <div className="text-center py-12 bg-muted rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
                    {level <= 2 ?
                        <LuBookOpen className="h-8 w-8 text-muted-foreground" /> :
                        <LuBookKey className="h-8 w-8 text-muted-foreground" />
                    }
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No subjects available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    There are currently no subjects available for {yearGroupName}. Check back later or explore other year groups.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => {
                const isSubscribed = isAuthenticated && userSubscriptions.includes(subject.id);
                return (
                    <div 
                        key={subject.id} 
                        className={`relative ${isSubscribed ? 'ring-2 ring-primary rounded-lg' : ''}`}
                    >
                        <SubjectItem subject={subject} />
                        {/* Subscription indicator badge */}
                        {isSubscribed && (
                            <div className="absolute top-2 right-2">
                                <Badge variant="default" className="text-xs bg-primary">
                                    <LuUsers className="h-3 w-3 mr-1" />
                                    Subscribed
                                </Badge>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default FilterableRevisionSubjectList;
