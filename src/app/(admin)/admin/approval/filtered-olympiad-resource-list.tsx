'use client';

// File: src/app/(admin)/admin/approval/filtered-olympiad-resource-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

// Define types for our data
type OlympiadResource = {
    id: number;
    title: string;
    desc: string;
    authorId: string;
    approved: boolean;
    type: number;
    olympiadId: number;
    olympiad: {
        id: number;
        title: string;
        area: string;
    };
    author: {
        firstname: string | null;
        lastname: string | null;
        email: string;
    };
    files: {
        id: number;
        filename: string;
        path: string;
    }[];
};

interface FilteredResourceListProps {
    resources: OlympiadResource[];
}

export default function FilteredOlympiadResourceList({ resources }: FilteredResourceListProps) {
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState<string | 'all'>('all');

    // Function to get type label
    const getResourceTypeLabel = (type: number) => {
        switch (type) {
            case 0:
                return "Past Paper";
            case 1:
                return "Solution";
            case 2:
                return "Other";
            default:
                return "Unknown";
        }
    };

    // Get unique areas for filtering
    const uniqueAreas = useMemo(() => {
        const areas = new Set<string>();
        resources.forEach(resource => areas.add(resource.olympiad.area));
        return Array.from(areas).sort();
    }, [resources]);

    // Filter resources based on search and area
    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            const matchesSearch =
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.olympiad.title.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesArea = selectedArea === 'all' || resource.olympiad.area === selectedArea;

            return matchesSearch && matchesArea;
        });
    }, [resources, searchTerm, selectedArea]);

    return (
        <div>
            {/* Filter controls */}
            <div className="mb-6 p-4 bg-muted rounded-lg border border-border">
                <h3 className="font-medium text-foreground mb-3">Filter Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="searchFilter" className="block text-sm font-medium text-foreground mb-1">
                            Search
                        </label>
                        <input
                            id="searchFilter"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title or description"
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        />
                    </div>

                    <div>
                        <label htmlFor="areaFilter" className="block text-sm font-medium text-foreground mb-1">
                            Subject Area
                        </label>
                        <select
                            id="areaFilter"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value === 'all' ? 'all' : e.target.value)}
                            className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
                        >
                            <option value="all">All Subject Areas</option>
                            {uniqueAreas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Resources count */}
            <h2 className="text-lg font-semibold mb-4">
                Pending Approvals ({filteredResources.length})
                {filteredResources.length !== resources.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                        (Filtered from {resources.length} total)
                    </span>
                )}
            </h2>

            {/* Resources list */}
            {filteredResources.length === 0 ? (
                <div className="text-center py-10 bg-card rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {resources.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">All caught up!</h3>
                            <p className="mt-1 text-muted-foreground">No olympiad resources are pending approval at this time.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-foreground">No matching resources</h3>
                            <p className="mt-1 text-muted-foreground">Try changing your filters to see more resources.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-card shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Olympiad
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Files
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredResources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-accent">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-foreground">{resource.title}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-xs">{resource.desc.substring(0, 50)}{resource.desc.length > 50 ? '...' : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{resource.olympiad.title}</div>
                                        <div className="text-xs text-muted-foreground">{resource.olympiad.area}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-foreground">{`${resource.author.firstname} ${resource.author.lastname}` || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{resource.author.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            variant={resource.type === 2 ? 'default' : 'secondary'}
                                        >
                                            {getResourceTypeLabel(resource.type)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {resource.files.length} file{resource.files.length !== 1 ? 's' : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/admin/approval/olympiad/${resource.id}`}
                                            className="text-primary hover:text-primary/80 px-3 py-1 rounded border border-primary hover:bg-primary/10"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}