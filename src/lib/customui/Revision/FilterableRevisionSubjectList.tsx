'use client';

import { useState } from 'react';
import { SubjectItem } from '@/lib/customui/Upload/SubjectItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
 * Enhanced revision subject list with subscription filtering
 */
const FilterableRevisionSubjectList = ({ 
    subjects, 
    year, 
    userSubscriptions, 
    isAuthenticated 
}: FilterableRevisionSubjectListProps) => {
    // Default to subscriptions only if user is authenticated and has subscriptions
    const [showSubscribedOnly, setShowSubscribedOnly] = useState(
        isAuthenticated && userSubscriptions.length > 0
    );

    // Filter subjects to only include those from visible year groups
    const visibleSubjects = subjects.filter((subject) => isYearGroupVisible(subject.level));
    
    // Apply subscription filter if enabled
    const filteredSubjects = showSubscribedOnly 
        ? visibleSubjects.filter(subject => userSubscriptions.includes(subject.id))
        : visibleSubjects;
    
    // Group subjects by level
    const f3 = filteredSubjects.filter((subject) => subject.level === 0);
    const f4 = filteredSubjects.filter((subject) => subject.level === 1);
    const f5 = filteredSubjects.filter((subject) => subject.level === 2);
    const f61 = filteredSubjects.filter((subject) => subject.level === 3);
    const f62 = filteredSubjects.filter((subject) => subject.level === 4);

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
    const currentDisplayCount = filteredSubjects.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Revision Resources</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Access study materials, practice questions, and resources for all subjects
                </p>
            </div>

            {/* Filter Controls */}
            {isAuthenticated && (
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <LuFilter className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium text-foreground">Filter:</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={!showSubscribedOnly ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowSubscribedOnly(false)}
                                    className="flex items-center gap-2"
                                >
                                    <LuGlobe className="h-4 w-4" />
                                    All Subjects
                                    <Badge variant="secondary" className="ml-1">
                                        {totalSubjects}
                                    </Badge>
                                </Button>
                                
                                <Button
                                    variant={showSubscribedOnly ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowSubscribedOnly(true)}
                                    className="flex items-center gap-2"
                                >
                                    <LuUsers className="h-4 w-4" />
                                    My Subscriptions
                                    <Badge variant="secondary" className="ml-1">
                                        {subscribedCount}
                                    </Badge>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Current filter status */}
                        <div className="text-sm text-muted-foreground">
                            {showSubscribedOnly ? (
                                subscribedCount === 0 ? (
                                    <span className="text-warning">No subscriptions found</span>
                                ) : (
                                    <span>Showing {currentDisplayCount} subscribed subject{currentDisplayCount !== 1 ? 's' : ''}</span>
                                )
                            ) : (
                                <span>Showing all {currentDisplayCount} subject{currentDisplayCount !== 1 ? 's' : ''}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state for no subscriptions */}
            {showSubscribedOnly && subscribedCount === 0 && (
                <div className="text-center py-12 bg-muted rounded-lg border border-border mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
                        <LuUsers className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Subscriptions Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        You haven't subscribed to any subjects yet. Subscribe to subjects to see their upcoming tests and get notifications.
                    </p>
                    <Button 
                        onClick={() => setShowSubscribedOnly(false)}
                        variant="outline"
                    >
                        <LuGlobe className="h-4 w-4 mr-2" />
                        Browse All Subjects
                    </Button>
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
                                    showSubscribedOnly={showSubscribedOnly}
                                    userSubscriptions={userSubscriptions}
                                    isAuthenticated={isAuthenticated}
                                    onShowAllSubjects={() => setShowSubscribedOnly(false)}
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
function SubjectListContent({ 
    subjects, 
    level, 
    yearGroupName, 
    showSubscribedOnly,
    userSubscriptions,
    isAuthenticated,
    onShowAllSubjects
}: {
    subjects: Subject[];
    level: number;
    yearGroupName: string;
    showSubscribedOnly: boolean;
    userSubscriptions: number[];
    isAuthenticated: boolean;
    onShowAllSubjects: () => void;
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
                <h3 className="text-lg font-medium text-foreground mb-1">
                    {showSubscribedOnly ? 'No subscribed subjects' : 'No subjects available'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    {showSubscribedOnly 
                        ? `You haven't subscribed to any subjects in ${yearGroupName} yet.`
                        : `There are currently no subjects available for ${yearGroupName}. Check back later or explore other year groups.`
                    }
                </p>
                {showSubscribedOnly && isAuthenticated && (
                    <Button onClick={onShowAllSubjects} variant="outline">
                        <LuGlobe className="h-4 w-4 mr-2" />
                        Show All {yearGroupName} Subjects
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
                <div key={subject.id} className="relative">
                    <SubjectItem subject={subject} />
                    {/* Subscription indicator */}
                    {isAuthenticated && userSubscriptions.includes(subject.id) && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="default" className="text-xs">
                                <LuUsers className="h-3 w-3 mr-1" />
                                Subscribed
                            </Badge>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default FilterableRevisionSubjectList;
