'use client';

import { useState, useMemo } from 'react';
import { OlympiadResourceCard } from '@/lib/customui/Basic/cards';
import { Collapsible } from "@chakra-ui/react";
import { LuSearch, LuX, LuExternalLink, LuFileText } from "react-icons/lu";
import MDViewer from "@/lib/customui/Basic/showMD";

interface OlympiadResource {
    id: number;
    title: string;
    desc: string;
    olympiadId: number;
    type: number;
    approved: boolean;
}

interface Olympiad {
    id: number;
    title: string;
    area: string;
    desc: string;
    links: string[];
    link_descriptions: string[];
}

interface SearchableOlympiadContentProps {
    olympiad: Olympiad;
    resources: OlympiadResource[];
}

/**
 * Client component that provides search functionality for olympiad resources
 * Filters resources and external links based on search query
 */
const SearchableOlympiadContent = ({ 
    olympiad, 
    resources
}: SearchableOlympiadContentProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Get resource type label
     */
    const getResourceTypeLabel = (type: number) => {
        switch (type) {
            case 0: return "Past Paper";
            case 1: return "Solution";
            case 2: return "Other";
            default: return "Unknown";
        }
    };

    /**
     * Filter resources based on search query
     */
    const filteredResources = useMemo(() => {
        if (!searchQuery.trim()) return resources;
        
        const lowerQuery = searchQuery.toLowerCase();
        return resources.filter(resource => 
            resource.title.toLowerCase().includes(lowerQuery) ||
            resource.desc.toLowerCase().includes(lowerQuery) ||
            getResourceTypeLabel(resource.type).toLowerCase().includes(lowerQuery)
        );
    }, [resources, searchQuery]);

    /**
     * Filter external links based on search query
     */
    const filteredLinks = useMemo(() => {
        if (!searchQuery.trim()) {
            return olympiad.links.map((link, index) => ({
                link,
                description: olympiad.link_descriptions && olympiad.link_descriptions[index]
                    ? olympiad.link_descriptions[index]
                    : 'No description available',
                index
            }));
        }
        
        const lowerQuery = searchQuery.toLowerCase();
        return olympiad.links
            .map((link, index) => ({
                link,
                description: olympiad.link_descriptions && olympiad.link_descriptions[index]
                    ? olympiad.link_descriptions[index]
                    : 'No description available',
                index
            }))
            .filter(item => 
                item.link.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery)
            );
    }, [olympiad.links, olympiad.link_descriptions, searchQuery]);

    /**
     * Clear search input
     */
    const clearSearch = () => {
        setSearchQuery('');
    };

    /**
     * Get total filtered results count
     */
    const totalResults = filteredResources.length + filteredLinks.length;

    return (
        <div>
            <h1>{olympiad.title}</h1>
            <div className="text-sm text-gray-600 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {olympiad.area}
                </span>
            </div>

            <Collapsible.Root defaultOpen>
                <Collapsible.Trigger paddingY="3"><h2>About</h2></Collapsible.Trigger>
                <Collapsible.Content>
                    <MDViewer content={olympiad.desc} />
                </Collapsible.Content>
            </Collapsible.Root>
            <br />

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LuSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resources and links..."
                        className="block w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <LuX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            {totalResults} result{totalResults !== 1 ? 's' : ''} found
                        </p>
                    </div>
                )}
            </div>

            {/* External Links Section */}
            <div className="mb-8">
                <h2 className="flex items-center mb-4">
                    <LuExternalLink className="h-5 w-5 mr-2" />
                    External Links
                    {searchQuery && filteredLinks.length > 0 && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {filteredLinks.length}
                        </span>
                    )}
                </h2>
                
                {filteredLinks.length === 0 ? (
                    searchQuery ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No external links found for &quot;{searchQuery}&quot;</p>
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                <LuExternalLink className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500">No external links available</p>
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredLinks.map((item) => (
                            <a
                                key={item.index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                            {item.description}
                                        </h3>
                                        <div className="flex items-center text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                                            <LuExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                                {item.link.replace(/^https?:\/\//, '')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200">
                                            <LuExternalLink className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Subtle animation line */}
                                <div className="mt-3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transform transition-transform duration-300 origin-left rounded-full"></div>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Resources Section */}
            <div>
                <h2 className="flex items-center mb-4">
                    <LuFileText className="h-5 w-5 mr-2" />
                    Resources
                    {searchQuery && filteredResources.length > 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {filteredResources.length}
                        </span>
                    )}
                </h2>

                {filteredResources.length === 0 ? (
                    searchQuery ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <LuFileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No resources found</h3>
                            <p className="text-gray-500">No resources found for &quot;{searchQuery}&quot;</p>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <LuFileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No resources available</h3>
                            <p className="text-gray-500">This olympiad doesn&apos;t have any resources yet.</p>
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="relative">
                                <OlympiadResourceCard resource={resource} />
                                {/* Resource type badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        resource.type === 0 ? 'bg-blue-100 text-blue-800' :
                                        resource.type === 1 ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {getResourceTypeLabel(resource.type)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableOlympiadContent; 