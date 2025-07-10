'use client';

import { University, UcasCourse } from '@prisma/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

interface UniversityListProps {
    universities: (University & { courses: UcasCourse[] })[];
}

const ITEMS_PER_PAGE = 10;

export default function UniversityList({ universities }: UniversityListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredUniversities = useMemo(() => {
        return universities.filter(uni =>
            uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            uni.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [universities, searchTerm]);

    const paginatedUniversities = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredUniversities.slice(startIndex, endIndex);
    }, [filteredUniversities, currentPage]);

    const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);

    if (universities.length === 0) {
        return <p className="text-muted-foreground">No universities found.</p>;
    }

    return (
        <div className="bg-card p-6 rounded-lg border border-border">
            <div className="mb-4">
                <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="max-w-sm"
                />
            </div>

            <Accordion type="single" collapsible className="w-full">
                {paginatedUniversities.map(uni => (
                    <AccordionItem key={uni.id} value={uni.id}>
                        <AccordionTrigger>
                            <div className="flex items-center justify-between w-full pr-4">
                                <span className="font-semibold">{uni.name}</span>
                                <div className="flex items-center space-x-4">
                                    <Badge>{uni.courses.length} course{uni.courses.length !== 1 ? 's' : ''}</Badge>
                                    <Button variant="ghost" size="icon" asChild onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/admin/ucas/universities/${uni.id}/edit`}>
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 p-4 bg-muted/50 rounded-md">
                                {uni.courses.length > 0 ? (
                                    uni.courses.map(course => (
                                        <div key={course.id} className="p-4 bg-background rounded-lg border border-border flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold">{course.name}</h4>
                                                <p className="text-sm text-muted-foreground">{course.qualification} - {course.duration_years} years</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {course.url && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={course.url} target="_blank" rel="noopener noreferrer">
                                                            Visit Page
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/ucas/courses/${course.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No courses have been added for this university yet.</p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 