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

/**
 * Component to display upcoming exams for subscribed subjects
 * Shows up to 8 tests ordered by date (earliest first)
 */
const UpcomingExams: React.FC = () => {
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
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Exams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                                <div className="h-4 bg-muted rounded mb-2"></div>
                                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                                <div className="h-6 bg-muted rounded mb-2 w-1/2"></div>
                                <div className="h-4 bg-muted rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Exams</h2>
                    <div className="text-center py-8">
                        <LuFileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (tests.length === 0) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Exams</h2>
                    <div className="text-center py-8">
                        <LuBookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No upcoming exams found</p>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to subjects to see their upcoming tests here
                        </p>
                        <Link 
                            href="/revision" 
                            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Browse Subjects
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Upcoming Exams</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tests.map((test) => {
                        const daysUntil = getDaysUntilTest(test.date);
                        const yearGroupName = getYearGroupName(test.subject.level);
                        
                        return (
                            <Link 
                                key={test.id} 
                                href={`/revision/${test.subjectId}/tests/${test.id}`}
                                className="block group"
                            >
                                <div className={cn(
                                    "p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                                    getUrgencyStyle(daysUntil)
                                )}>
                                    {/* Header with urgency badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {test.title}
                                            </h3>
                                        </div>
                                        {getUrgencyBadge(daysUntil)}
                                    </div>

                                    {/* Subject info */}
                                    <div className="mb-3">
                                        <Badge variant="outline" className="text-xs">
                                            {yearGroupName} {test.subject.title}
                                        </Badge>
                                    </div>

                                    {/* Test type */}
                                    <div className="mb-3">
                                        <TestBadge type={test.type} />
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <LuCalendar className="w-4 h-4 mr-2" />
                                        {formatDate(test.date)}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default UpcomingExams;
