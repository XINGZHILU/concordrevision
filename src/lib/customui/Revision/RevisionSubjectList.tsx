'use client';

import { SubjectItem } from '../Upload/SubjectItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { year_group_names } from "@/lib/consts";
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
    // Group subjects by level
    const f3 = subjects.filter((subject) => subject.level === 0);
    const f4 = subjects.filter((subject) => subject.level === 1);
    const f5 = subjects.filter((subject) => subject.level === 2);
    const f61 = subjects.filter((subject) => subject.level === 3);
    const f62 = subjects.filter((subject) => subject.level === 4);

    const tabIds = ['f3', 'f4', 'f5', '61', '62'];
    const defaultTab = tabIds[year] || 'f3';

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

            <Tabs defaultValue={defaultTab}>
                <div className="border-b border-border mb-8">
                    <div className="flex justify-center">
                        <TabsList>
                            <TabsTrigger value="f3" className="flex items-center px-3 py-2 text-sm font-medium">
                                {getYearGroupIcon(0)}
                                {year_group_names[0]}
                            </TabsTrigger>
                            <TabsTrigger value="f4" className="flex items-center px-3 py-2 text-sm font-medium">
                                {getYearGroupIcon(1)}
                                {year_group_names[1]}
                            </TabsTrigger>
                            <TabsTrigger value="f5" className="flex items-center px-3 py-2 text-sm font-medium">
                                {getYearGroupIcon(2)}
                                {year_group_names[2]}
                            </TabsTrigger>
                            <TabsTrigger value="61" className="flex items-center px-3 py-2 text-sm font-medium">
                                {getYearGroupIcon(3)}
                                {year_group_names[3]}
                            </TabsTrigger>
                            <TabsTrigger value="62" className="flex items-center px-3 py-2 text-sm font-medium">
                                {getYearGroupIcon(4)}
                                {year_group_names[4]}
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <TabsContent value="f3">
                    <SubjectListContent subjects={f3} level={0} />
                </TabsContent>
                <TabsContent value="f4">
                    <SubjectListContent subjects={f4} level={1} />
                </TabsContent>
                <TabsContent value="f5">
                    <SubjectListContent subjects={f5} level={2} />
                </TabsContent>
                <TabsContent value="61">
                    <SubjectListContent subjects={f61} level={3} />
                </TabsContent>
                <TabsContent value="62">
                    <SubjectListContent subjects={f62} level={4} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Subject list content with empty state handling
function SubjectListContent({ subjects, level }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[],
    level: number
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
                    There are currently no subjects available for {year_group_names[level]}.
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