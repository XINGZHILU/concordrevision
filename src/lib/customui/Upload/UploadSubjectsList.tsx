'use client';

import Image from 'next/image'
import React from 'react'
import { assets } from '@/lib/assets'
import Link from 'next/link'
import { year_group_names } from "@/lib/consts";
import { Badge } from "@chakra-ui/react";

export function SubjectItem({ subject }: {
    subject: {
        id: number,
        title: string,
        desc: string,
        level: number,
    }
}) {
    // Generate a consistent background color based on subject ID
    const getSubjectColor = () => {
        const colors = ['indigo', 'purple', 'sky', 'emerald', 'amber', 'rose'];
        return colors[subject.id % colors.length];
    };

    const subjectColor = getSubjectColor();

    return (
        <div className="p-2">
            <Link
                href={`/revision/${subject.id}`}
                className={`block w-full h-full bg-white border-2 border-${subjectColor}-200 hover:border-${subjectColor}-500 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden`}
            >
                <div className={`p-1 bg-${subjectColor}-50`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{subject.title}</h3>
                            <Badge colorPalette={subjectColor} className="ml-2 text-xs">
                                {year_group_names[subject.level]}
                            </Badge>
                        </div>

                        {subject.desc && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subject.desc}</p>
                        )}

                        <div className="flex items-center justify-end text-sm font-medium text-indigo-600 hover:text-indigo-800 group-hover:translate-x-1 transition-transform">
                            <span>Explore</span>
                            <Image
                                src={assets.arrow}
                                className="ml-1 group-hover:translate-x-1 transition-transform"
                                alt="Arrow"
                                width={14}
                                height={14}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}