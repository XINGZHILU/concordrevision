'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { LuCalendar, LuClock, LuBookOpen, LuFileText } from 'react-icons/lu';
import { TestBadge } from './Badges';
import { getYearGroupName } from '@/lib/year-group-config';
import { cn } from '@/lib/utils';

interface UpcomingTest {
    id: number;
    title: string;
    desc: string;
    type: number;
    date: string;
    subjectId: number;
    subject: {
        id: number;
        title: string;
        level: number;
    };
}

interface UpcomingExamsProps {
    maxDates?: number; // Maximum number of unique dates to display (default: 4)
}

/**
 * Component to display upcoming exams for subscribed subjects
 * Shows tests ordered by date (earliest first), grouped by date
 * @param maxDates - Maximum number of unique dates to display (default: 4)
 */
const UpcomingExams: React.FC<UpcomingExamsProps> = ({ maxDates = 8 }) => {
    const [tests, setTests] = useState<UpcomingTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUpcomingTests();
    }, []);

    const fetchUpcomingTests = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/upcoming-tests');
            
            if (!response.ok) {
                if (response.status === 401) {
                    // User not authenticated, don't show error
                    setTests([]);
                    return;
                }
                throw new Error('Failed to fetch upcoming tests');
            }

            const data = await response.json();
            setTests(data);
        } catch (err) {
            console.error('Error fetching upcoming tests:', err);
            setError('Failed to load upcoming exams');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calculate days until test date
     */
    const getDaysUntilTest = (dateString: string): number => {
        const testDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        testDate.setHours(0, 0, 0, 0);
        
        const diffTime = testDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    /**
     * Get urgency styling based on days until test
     */
    const getUrgencyStyle = (daysUntil: number) => {
        if (daysUntil === 0) return 'border-destructive/60 bg-destructive/10';
        if (daysUntil <= 3) return 'border-warning/60 bg-warning/10';
        if (daysUntil <= 7) return 'border-primary/60 bg-primary/10';
        return 'border-border bg-card';
    };

    /**
     * Get urgency badge
     */
    const getUrgencyBadge = (daysUntil: number) => {
        if (daysUntil === 0) {
            return (
                <Badge variant="destructive" className="text-xs">
                    <LuClock className="w-3 h-3 mr-1" />
                    Today
                </Badge>
            );
        }
        if (daysUntil === 1) {
            return (
                <Badge variant="destructive" className="text-xs">
                    <LuClock className="w-3 h-3 mr-1" />
                    Tomorrow
                </Badge>
            );
        }
        if (daysUntil <= 7) {
            return (
                <Badge variant="secondary" className="text-xs">
                    <LuClock className="w-3 h-3 mr-1" />
                    {daysUntil} days
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-xs">
                <LuClock className="w-3 h-3 mr-1" />
                {daysUntil} days
            </Badge>
        );
    };

    if (loading) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Exams</h2>
                    {/* Show 2 rows of loading skeletons */}
                    <div className="flex flex-col gap-4">
                        {[0, 1].map((rowIdx) => (
                            <div 
                                key={`loading-row-${rowIdx}`}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border rounded-lg overflow-hidden"
                            >
                                {[...Array(4)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "flex flex-col",
                                            i < 3 && "md:border-r border-border",
                                            i < 3 && "border-b md:border-b-0 border-border"
                                        )}
                                    >
                                        {/* Date header skeleton */}
                                        <div className="bg-background p-3 border-b border-border animate-pulse">
                                            <div className="h-4 bg-muted rounded mb-1.5 w-3/4"></div>
                                            <div className="h-5 bg-muted rounded w-1/2"></div>
                                        </div>
                                        {/* Test cards skeleton */}
                                        <div className="flex flex-col p-2 gap-2 bg-muted/20">
                                            {[...Array(2)].map((_, j) => (
                                                <div key={j} className="bg-card border border-border rounded-md p-3 animate-pulse">
                                                    <div className="h-3.5 bg-muted rounded mb-2 w-full"></div>
                                                    <div className="h-5 bg-muted rounded mb-1.5 w-2/3"></div>
                                                    <div className="h-5 bg-muted rounded w-1/2"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Exams</h2>
                    <div className="text-center py-6">
                        <LuFileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground text-sm">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (tests.length === 0) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Exams</h2>
                    <div className="text-center py-6">
                        <LuBookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-1.5 text-sm">No upcoming exams found</p>
                        <p className="text-xs text-muted-foreground">
                            Subscribe to subjects to see their upcoming tests here
                        </p>
                        <Link 
                            href="/revision" 
                            className="inline-block mt-3 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Browse Subjects
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    /**
     * Group tests by date and limit to specified number of unique dates
     */
    const groupTestsByDate = () => {
        const groupedTests: { [key: string]: UpcomingTest[] } = {};
        const uniqueDates: string[] = [];

        // Group tests by their date string
        tests.forEach((test) => {
            const dateKey = test.date.split('T')[0]; // Get YYYY-MM-DD format
            
            if (!groupedTests[dateKey]) {
                groupedTests[dateKey] = [];
                uniqueDates.push(dateKey);
            }
            
            // Only add test if we haven't exceeded maxDates
            if (uniqueDates.indexOf(dateKey) < maxDates) {
                groupedTests[dateKey].push(test);
            }
        });

        // Return only the first maxDates dates
        return uniqueDates.slice(0, maxDates).map(dateKey => ({
            date: dateKey,
            tests: groupedTests[dateKey]
        }));
    };

    const groupedByDate = groupTestsByDate();
    
    /**
     * Split dates into rows of maximum 4 columns each
     */
    const splitIntoRows = () => {
        const rows: typeof groupedByDate[] = [];
        for (let i = 0; i < groupedByDate.length; i += 4) {
            rows.push(groupedByDate.slice(i, i + 4));
        }
        return rows;
    };
    
    const dateRows = splitIntoRows();

    return (
        <section className="py-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Upcoming Exams</h2>
                </div>
                
                {/* Multiple rows if needed, each with constant 4 columns */}
                <div className="flex flex-col gap-4">
                    {dateRows.map((rowDates, rowIndex) => (
                        <div 
                            key={`row-${rowIndex}`}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border rounded-lg overflow-hidden"
                        >
                            {/* Render date columns - always maintain 4 columns */}
                            {[0, 1, 2, 3].map((colIndex) => {
                                const dateGroup = rowDates[colIndex];
                                
                                // If no data for this column, render empty cell
                                if (!dateGroup) {
                                    return (
                                        <div 
                                            key={`empty-${rowIndex}-${colIndex}`}
                                            className={cn(
                                                "flex flex-col border-border bg-muted/10",
                                                // Add right border except for last column
                                                colIndex < 3 && "md:border-r",
                                                // Add bottom border on mobile for all except last
                                                colIndex < 3 && "border-b md:border-b-0"
                                            )}
                                        >
                                            {/* Empty column placeholder */}
                                            <div className="p-3 border-b border-border min-h-[80px]"></div>
                                            <div className="flex-1 p-2 min-h-[100px]"></div>
                                        </div>
                                    );
                                }
                                
                                const firstTest = dateGroup.tests[0];
                                const daysUntil = getDaysUntilTest(firstTest.date);
                                
                                return (
                                    <div 
                                        key={dateGroup.date} 
                                        className={cn(
                                            "flex flex-col border-border",
                                            // Add right border except for last column
                                            colIndex < 3 && "md:border-r",
                                            // Add bottom border on mobile for all except last
                                            colIndex < 3 && "border-b md:border-b-0"
                                        )}
                                    >
                                {/* Date header */}
                                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-base text-card-foreground">
                                                {formatDate(firstTest.date)}
                                            </h3>
                                            <div className="mt-1">
                                                {getUrgencyBadge(daysUntil)}
                                            </div>
                                        </div>
                                        <LuCalendar className="w-5 h-5 text-primary" />
                                    </div>
                                </div>

                                {/* Tests for this date */}
                                <div className="flex flex-col p-2 gap-2 bg-muted/20">
                                    {dateGroup.tests.map((test) => {
                                        const yearGroupName = getYearGroupName(test.subject.level);
                                        
                                        return (
                                            <Link 
                                                key={test.id} 
                                                href={`/revision/${test.subjectId}/tests/${test.id}`}
                                                className="block group"
                                            >
                                                <div className={cn(
                                                    "p-3 rounded-md border transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                                                    getUrgencyStyle(daysUntil)
                                                )}>
                                                    {/* Test title */}
                                                    <h4 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                                        {test.title}
                                                    </h4>

                                                    {/* Subject info */}
                                                    <div className="mb-1.5">
                                                        <Badge variant="outline" className="text-xs">
                                                            {yearGroupName} {test.subject.title}
                                                        </Badge>
                                                    </div>

                                                    {/* Test type */}
                                                    <div>
                                                        <TestBadge type={test.type} />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpcomingExams;
