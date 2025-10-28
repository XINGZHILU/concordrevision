import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { year_group_names } from "@/lib/consts";
import { Card, CardHeader, CardTitle } from '@/lib/components/ui/card';
import Link from "next/link";
import { getVisibleYearGroups } from "@/lib/year-group-config";

export default async function TeacherDeleteSubjectsPage() {
    // Get visible year group levels
    const visibleYearGroups = getVisibleYearGroups();
    const visibleLevels = visibleYearGroups.map(group => group.level);

    // Fetch subjects that belong to visible year groups only
    const subjects = await prisma.subject.findMany({
        where: {
            level: {
                in: visibleLevels,
            },
        },
        orderBy: { title: 'asc' }
    });

    const subjectsByLevel = subjects.reduce((acc, subject) => {
        const level = subject.level || 0;
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(subject);
        return acc;
    }, {} as Record<number, typeof subjects>);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Delete Revision Notes</h1>
            <p className="text-muted-foreground mb-8">Select a subject to view and delete its revision notes.</p>
            <Tabs defaultValue="0">
                <TabsList>
                    {Object.keys(subjectsByLevel).map(level => (
                        <TabsTrigger key={level} value={level}>
                            {year_group_names[parseInt(level)]}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {Object.entries(subjectsByLevel).map(([level, subjects]) => (
                    <TabsContent key={level} value={level}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subjects.map(subject => (
                                <Link key={subject.id} href={`/teachers/delete/revision/${subject.id}`} className="block">
                                    <Card className="hover:border-primary transition-colors h-full">
                                        <CardHeader>
                                            <CardTitle className="text-base">{subject.title}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

