'use client';

// File: src/app/(admin)/admin/approval/filtered-olympiad-resource-list.tsx

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from "@chakra-ui/react";

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
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Filter Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            id="searchFilter"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title or description"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="areaFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Area
                        </label>
                        <select
                            id="areaFilter"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value === 'all' ? 'all' : e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        (Filtered from {resources.length} total)
                    </span>
                )}
            </h2>

            {/* Resources list */}
            {filteredResources.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {resources.length === 0 ? (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">All caught up!</h3>
                            <p className="mt-1 text-gray-500">No olympiad resources are pending approval at this time.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No matching resources</h3>
                            <p className="mt-1 text-gray-500">Try changing your filters to see more resources.</p>
                        </>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Olympiad
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Files
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredResources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{resource.desc.substring(0, 50)}{resource.desc.length > 50 ? '...' : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{resource.olympiad.title}</div>
                                        <div className="text-xs text-gray-500">{resource.olympiad.area}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{`${resource.author.firstname} ${resource.author.lastname}` || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{resource.author.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge
                                            colorPalette={resource.type === 0 ? 'blue' : resource.type === 1 ? 'green' : 'purple'}
                                        >
                                            {getResourceTypeLabel(resource.type)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {resource.files.length} file{resource.files.length !== 1 ? 's' : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/admin/approval/olympiad/${resource.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded border border-indigo-600 hover:bg-indigo-50"
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