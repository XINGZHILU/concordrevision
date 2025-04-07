/* eslint-disable @typescript-eslint/no-explicit-any */
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
        resources?: any[]
    }
}) {
    // Get appropriate icon based on olympiad area
    const OlympiadIcon = getOlympiadIcon(olympiad.area);
    
    // Get color theme based on subject area
    const colorTheme = getColorTheme(olympiad.area);
    
    // Create a truncated description
    const shortDesc = olympiad.desc 
        ? truncateDescription(olympiad.desc, 100) 
        : "Explore resources and materials for this olympiad competition";
        
    // Count resources if available
    const resourceCount = olympiad.resources ? olympiad.resources.length : 0;

    return (
        <div className="p-3">
            <Link href={`/olympiads/${olympiad.id}`} className="block h-full">
                <div 
                    className={`group relative h-full overflow-hidden rounded-xl transition-all duration-300 ${colorTheme.gradientBg} hover:shadow-xl hover:-translate-y-1`}
                >
                    {/* Trophy decoration - top right */}
                    <div className="absolute top-4 right-4 opacity-10">
                        <LuTrophy className="h-24 w-24 text-white" />
                    </div>
                    
                    {/* Card content */}
                    <div className="relative z-10 p-6">
                        {/* Subject area badge */}
                        <Badge 
                            className={`${colorTheme.badgeBg} text-white font-semibold px-2.5 py-1 rounded-full text-xs uppercase tracking-wider`}
                        >
                            {olympiad.area}
                        </Badge>
                        
                        {/* Title and icon */}
                        <div className="mt-3 flex items-start">
                            <div className={`mr-3 p-2 rounded-full ${colorTheme.iconBg}`}>
                                <OlympiadIcon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-white">
                                {olympiad.title}
                            </h3>
                        </div>
                        
                        {/* Description */}
                        <p className="mt-3 text-sm text-white/80 line-clamp-3 mb-4">
                            {shortDesc}
                        </p>
                        
                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-white/20 flex justify-between items-center">
                            <div className="text-white text-opacity-90 text-xs font-medium">
                                {resourceCount > 0 ? (
                                    <span>{resourceCount} resource{resourceCount !== 1 ? 's' : ''} available</span>
                                ) : (
                                    <span>Competition resources</span>
                                )}
                            </div>
                            <span className="inline-flex items-center text-white font-medium text-sm">
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
function truncateDescription(text: string, maxLength: number): string {
    // Remove any Markdown formatting
    const plainText = text.replace(/[#*_~`]/g, '');
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
}

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

// Helper function to get color theme based on olympiad area
function getColorTheme(area: string) {
    const subject = area.toLowerCase();
    
    if (subject.includes('math')) {
        return {
            gradientBg: 'bg-gradient-to-br from-blue-600 to-indigo-800',
            badgeBg: 'bg-blue-500',
            iconBg: 'bg-blue-500',
        };
    }
    
    if (subject.includes('physics')) {
        return {
            gradientBg: 'bg-gradient-to-br from-violet-600 to-purple-800',
            badgeBg: 'bg-violet-500',
            iconBg: 'bg-violet-500',
        };
    }
    
    if (subject.includes('chemistry')) {
        return {
            gradientBg: 'bg-gradient-to-br from-emerald-600 to-green-800',
            badgeBg: 'bg-emerald-500',
            iconBg: 'bg-emerald-500',
        };
    }
    
    if (subject.includes('biology')) {
        return {
            gradientBg: 'bg-gradient-to-br from-amber-600 to-orange-700',
            badgeBg: 'bg-amber-500',
            iconBg: 'bg-amber-500',
        };
    }
    
    if (subject.includes('computer') || subject.includes('informatics')) {
        return {
            gradientBg: 'bg-gradient-to-br from-cyan-600 to-blue-800',
            badgeBg: 'bg-cyan-500',
            iconBg: 'bg-cyan-500',
        };
    }
    
    if (subject.includes('economics')) {
        return {
            gradientBg: 'bg-gradient-to-br from-rose-600 to-red-800',
            badgeBg: 'bg-rose-500',
            iconBg: 'bg-rose-500',
        };
    }
    
    // Default theme
    return {
        gradientBg: 'bg-gradient-to-br from-gray-700 to-gray-900',
        badgeBg: 'bg-gray-600',
        iconBg: 'bg-gray-600',
    };
}