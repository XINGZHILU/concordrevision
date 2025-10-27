'use client';

import { SubjectItem } from '../Upload/SubjectItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVisibleYearGroups, isYearGroupVisible } from "@/lib/year-group-config";
import { LuBookOpen, LuBookPlus, LuBookUp, LuBookKey, LuBookMarked } from "react-icons/lu";

const RevisionSubjectList = ({ subjects, year }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[],
    year: number
}) => {
    // Filter subjects to only include those from visible year groups
    const visibleSubjects = subjects.filter((subject) => isYearGroupVisible(subject.level));
    
    // Group subjects by level
    const f3 = visibleSubjects.filter((subject) => subject.level === 0);
    const f4 = visibleSubjects.filter((subject) => subject.level === 1);
    const f5 = visibleSubjects.filter((subject) => subject.level === 2);
    const f61 = visibleSubjects.filter((subject) => subject.level === 3);
    const f62 = visibleSubjects.filter((subject) => subject.level === 4);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Revision Resources</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Access study materials, practice questions, and resources for all subjects
                </p>
            </div>

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
                                {visibleYearGroups.map(group => (
                                    <TabsTrigger 
                                        key={group.tabId} 
                                        value={group.tabId} 
                                        className="flex items-center px-3 py-2 text-sm font-medium"
                                    >
                                        {getYearGroupIcon(group.level)}
                                        {group.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </div>

                    {visibleYearGroups.map(group => {
                        const contentMap: { [key: number]: typeof f3 } = {
                            0: f3, 1: f4, 2: f5, 3: f61, 4: f62
                        };
                        return (
                            <TabsContent key={group.tabId} value={group.tabId}>
                                <SubjectListContent 
                                    subjects={contentMap[group.level] || []} 
                                    level={group.level}
                                    yearGroupName={group.name}
                                />
                            </TabsContent>
                        );
                    })}
                </Tabs>
            )}
        </div>
    );
};

// Subject list content with empty state handling
function SubjectListContent({ subjects, level, yearGroupName }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[],
    level: number,
    yearGroupName: string
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
                    There are currently no subjects available for {yearGroupName}.
                    Check back later or explore other year groups.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
                <SubjectItem key={subject.id} subject={subject} />
            ))}
        </div>
    );
}

export default RevisionSubjectList;