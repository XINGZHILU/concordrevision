'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from "@chakra-ui/react";
import { 
    LuTrophy, 
    LuCalculator,
    LuFlaskConical, 
    LuAtom, 
    LuBrain, 
    LuMicroscope,
    LuActivity,
    LuGlobe,
    LuBraces,
    LuArrowUpRight
} from "react-icons/lu";

export function OlympiadCard({ olympiad }: {
    olympiad: {
        id: number,
        title: string,
        desc: string,
        area: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resources?: any[]
    }
}) {
    // Get appropriate icon based on olympiad area
    const OlympiadIcon = getOlympiadIcon(olympiad.area);
        
    // Count resources if available
    const resourceCount = olympiad.resources ? olympiad.resources.length : 0;

    return (
        <div className="p-3">
            <Link href={`/olympiads/${olympiad.id}`} className="block h-full">
                <div 
                    className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    {/* Trophy decoration - top right */}
                    <div className="absolute top-4 right-4 opacity-10">
                        <LuTrophy className="h-24 w-24 text-gray-500" />
                    </div>
                    
                    {/* Card content */}
                    <div className="relative z-10 p-6">
                        {/* Subject area badge */}
                        <Badge 
                            className="bg-gray-200 text-gray-700 font-medium px-2.5 py-1 rounded-full text-xs uppercase tracking-wider"
                        >
                            {olympiad.area}
                        </Badge>
                        
                        {/* Title and icon */}
                        <div className="mt-3 flex items-start">
                            <div className="mr-3 p-2 rounded-full bg-gray-100">
                                <OlympiadIcon className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700">
                                {olympiad.title}
                            </h3>
                        </div>
                        
                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-gray-600 text-xs font-medium">
                                {resourceCount > 0 ? (
                                    <span>{resourceCount} resource{resourceCount !== 1 ? 's' : ''} available</span>
                                ) : (
                                    <span>Competition resources</span>
                                )}
                            </div>
                            <span className="inline-flex items-center text-gray-700 font-medium text-sm">
                                Explore
                                <LuArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-[-0.25rem]" />
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

// Helper function to get appropriate icon based on olympiad area
function getOlympiadIcon(area: string) {
    const subject = area.toLowerCase();
    
    if (subject.includes('math')) return LuCalculator;
    if (subject.includes('physics')) return LuAtom;
    if (subject.includes('chemistry')) return LuFlaskConical;
    if (subject.includes('biology')) return LuMicroscope;
    if (subject.includes('computer') || subject.includes('informatics')) return LuBraces;
    if (subject.includes('economics')) return LuActivity;
    if (subject.includes('geography') || subject.includes('earth')) return LuGlobe;
    
    // Default icon
    return LuBrain;
}