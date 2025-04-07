'use client';

import React from 'react';
import Link from 'next/link';
import { year_group_names } from "@/lib/consts";
import { Badge } from "@chakra-ui/react";
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
    
    // Get color theme based on year group or subject type
    const colorTheme = getColorTheme(subject.level);
    
    // Create a truncated description
    const shortDesc = subject.desc 
        ? truncateDescription(subject.desc, 80) 
        : "Explore materials and resources for this subject";

    return (
        <div className="p-3">
            <Link href={`/revision/${subject.id}`} className="block h-full">
                <div 
                    className={`group relative overflow-hidden h-full rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg ${colorTheme.hoverShadow}`}
                >
                    {/* Decorative band on left side */}
                    <div className={`absolute left-0 top-0 h-full w-1.5 ${colorTheme.band}`} />
                    
                    {/* Card content */}
                    <div className="p-5 pl-6">
                        {/* Header with subject title and year badge */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className={`mr-3 p-2 rounded-lg ${colorTheme.iconBg}`}>
                                    <SubjectIcon className={`h-5 w-5 ${colorTheme.icon}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
                                    {subject.title}
                                </h3>
                            </div>
                            <Badge 
                                className={`${colorTheme.badge} ml-2`}
                                size="sm"
                            >
                                {year_group_names[subject.level]}
                            </Badge>
                        </div>
                        
                        {/* Description */}
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                            {shortDesc}
                        </p>
                        
                        {/* Footer - view button */}
                        <div className="mt-4 flex items-center text-sm font-medium">
                            <span className={`${colorTheme.text} group-hover:underline flex items-center`}>
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
function truncateDescription(text: string, maxLength: number): string {
    // Remove any Markdown formatting
    const plainText = text.replace(/[#*_~`]/g, '');
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
}

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

// Helper function to get color theme based on year group or level
function getColorTheme(level: number) {
    switch (level) {
        case 0: // Form 3
            return {
                band: 'bg-blue-500',
                iconBg: 'bg-blue-100',
                icon: 'text-blue-600',
                badge: 'bg-blue-100 text-blue-800',
                text: 'text-blue-600',
                hoverShadow: 'hover:shadow-blue-100'
            };
        case 1: // Form 4
            return {
                band: 'bg-indigo-500',
                iconBg: 'bg-indigo-100',
                icon: 'text-indigo-600',
                badge: 'bg-indigo-100 text-indigo-800',
                text: 'text-indigo-600',
                hoverShadow: 'hover:shadow-indigo-100'
            };
        case 2: // Form 5
            return {
                band: 'bg-purple-500',
                iconBg: 'bg-purple-100',
                icon: 'text-purple-600',
                badge: 'bg-purple-100 text-purple-800',
                text: 'text-purple-600',
                hoverShadow: 'hover:shadow-purple-100'
            };
        case 3: // 6.1
            return {
                band: 'bg-green-500',
                iconBg: 'bg-green-100',
                icon: 'text-green-600',
                badge: 'bg-green-100 text-green-800',
                text: 'text-green-600',
                hoverShadow: 'hover:shadow-green-100'
            };
        case 4: // 6.2
            return {
                band: 'bg-amber-500',
                iconBg: 'bg-amber-100',
                icon: 'text-amber-600',
                badge: 'bg-amber-100 text-amber-800',
                text: 'text-amber-600',
                hoverShadow: 'hover:shadow-amber-100'
            };
        default:
            return {
                band: 'bg-gray-500',
                iconBg: 'bg-gray-100',
                icon: 'text-gray-600',
                badge: 'bg-gray-100 text-gray-800',
                text: 'text-gray-600',
                hoverShadow: 'hover:shadow-gray-100'
            };
    }
}