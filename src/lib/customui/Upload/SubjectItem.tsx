'use client';

import React from 'react';
import Link from 'next/link';
import { year_group_names } from "@/lib/consts";
import { Badge } from "../../../components/ui/badge";
import {
    LuBook,
    LuBeaker,
    LuPencilRuler,
    LuCalculator,
    LuLanguages,
    LuFlaskConical,
    LuAtom,
    LuBookOpen,
    LuGlobe,
    LuArrowRight
} from "react-icons/lu";

export function SubjectItem({ subject }: {
    subject: {
        id: number,
        title: string,
        desc: string,
        level: number,
    }
}) {
    // Get appropriate icon based on subject title or other criteria
    const SubjectIcon = getSubjectIcon(subject.title);

    return (
        <div className="p-3">
            <Link href={`/revision/${subject.id}`} className="block h-full">
                <div
                    className="group relative overflow-hidden h-full rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
                >
                    {/* Decorative band on left side */}
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-muted" />

                    {/* Card content */}
                    <div className="p-5 pl-6">
                        {/* Header with subject title and year badge */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="mr-3 p-2 rounded-lg bg-muted">
                                    <SubjectIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary">
                                    {subject.title}
                                </h3>
                            </div>
                            <Badge
                                variant="secondary"
                                className="ml-2"
                            >
                                {year_group_names[subject.level]}
                            </Badge>
                        </div>


                        {/* Footer - view button */}
                        <div className="mt-4 flex items-center text-sm font-medium">
                            <span className="text-accent-foreground group-hover:underline flex items-center">
                                View Resources
                                <LuArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

// Function to truncate description text
/*
function truncateDescription(text: string, maxLength: number): string {
    // Remove any Markdown formatting
    const plainText = text.replace(/[#*_~`]/g, '');
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
}
*/

// Helper function to get appropriate icon based on subject name
function getSubjectIcon(subjectTitle: string) {
    const title = subjectTitle.toLowerCase();

    if (title.includes('math') || title.includes('maths')) return LuCalculator;
    if (title.includes('physics')) return LuAtom;
    if (title.includes('chemistry')) return LuFlaskConical;
    if (title.includes('biology')) return LuBeaker;
    if (title.includes('english') || title.includes('literature')) return LuBookOpen;
    if (title.includes('language') || title.includes('spanish') || title.includes('french')) return LuLanguages;
    if (title.includes('geography') || title.includes('earth')) return LuGlobe;
    if (title.includes('art') || title.includes('design')) return LuPencilRuler;

    // Default icon
    return LuBook;
}