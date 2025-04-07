'use client';

import { useState } from "react";
import { olympiad_subjects } from "@/lib/consts";
import { OlympiadCard } from '@/lib/customui/Olympiads/OlympiadCard';
import { 
    LuCalculator,
    LuFlaskConical, 
    LuAtom, 
    LuBrain, 
    LuMicroscope,
    LuActivity,
    LuGlobe,
    LuBraces,
    LuSearch,
    LuFilter
} from "react-icons/lu";

export default function OlympiadsList({ olympiads }: {
    olympiads: {
        id: number,
        title: string,
        desc: string,
        area: string,
        resources?: any[]
    }[]
}) {
    const [selectedArea, setSelectedArea] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    // Get area icon
    const getAreaIcon = (area: string) => {
        const subject = area.toLowerCase();
        
        if (subject.includes('math')) return <LuCalculator className="mr-2 h-5 w-5" />;
        if (subject.includes('physics')) return <LuAtom className="mr-2 h-5 w-5" />;
        if (subject.includes('chemistry')) return <LuFlaskConical className="mr-2 h-5 w-5" />;
        if (subject.includes('biology')) return <LuMicroscope className="mr-2 h-5 w-5" />;
        if (subject.includes('computer')) return <LuBraces className="mr-2 h-5 w-5" />;
        if (subject.includes('economics')) return <LuActivity className="mr-2 h-5 w-5" />;
        if (subject.includes('geography')) return <LuGlobe className="mr-2 h-5 w-5" />;
        
        return <LuBrain className="mr-2 h-5 w-5" />;
    };
    
    // Filter olympiads by area and search query
    const filteredOlympiads = olympiads.filter((olympiad) => {
        const matchesArea = selectedArea === "All" || olympiad.area === selectedArea;
        const matchesSearch = searchQuery === "" || 
            olympiad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            olympiad.desc.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesArea && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Academic Olympiads</h1>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    Explore international competitions, preparation materials, and resources for academic olympiads
                </p>
            </div>
            
            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search bar */}
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LuSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Search olympiads..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    {/* Filter by subject area */}
                    <div className="flex items-center">
                        <LuFilter className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-600 mr-2">Filter:</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedArea("All")}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                                    selectedArea === "All"
                                        ? "bg-indigo-100 text-indigo-800 font-medium"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All
                            </button>
                            
                            {olympiad_subjects.map((area) => (
                                <button
                                    key={area}
                                    onClick={() => setSelectedArea(area)}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center ${
                                        selectedArea === area
                                            ? "bg-indigo-100 text-indigo-800 font-medium"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {getAreaIcon(area)}
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Results count */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    {selectedArea === "All" ? "All Olympiads" : selectedArea + " Olympiads"}
                    <span className="ml-2 text-gray-500 text-base font-normal">
                        ({filteredOlympiads.length} {filteredOlympiads.length === 1 ? 'competition' : 'competitions'})
                    </span>
                </h2>
            </div>
            
            {/* Olympiads grid */}
            {filteredOlympiads.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <LuBrain className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No olympiads found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {searchQuery
                            ? `No results matching "${searchQuery}". Try another search term or select a different subject area.`
                            : `No olympiads available for ${selectedArea}. Try selecting a different subject area.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOlympiads.map((olympiad) => (
                        <OlympiadCard key={olympiad.id} olympiad={olympiad} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function OlympiadsUploadList({ olympiads }: {
    olympiads: {
        id: number,
        title: string,
        desc: string,
        area: string
    }[]
}) {
    const [selectedArea, setSelectedArea] = useState<string>("All");
    
    // Filter olympiads by area
    const filteredOlympiads = olympiads.filter((olympiad) => {
        return selectedArea === "All" || olympiad.area === selectedArea;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Upload Olympiad Resources</h1>
                <p className="mt-2 text-gray-600">
                    Select an olympiad to upload competition materials or resources
                </p>
            </div>
            
            {/* Filter by subject area */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-600 mr-2">Filter by subject:</span>
                    <button
                        onClick={() => setSelectedArea("All")}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                            selectedArea === "All"
                                ? "bg-indigo-600 text-white font-medium"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        All
                    </button>
                    
                    {olympiad_subjects.map((area) => (
                        <button
                            key={area}
                            onClick={() => setSelectedArea(area)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                                selectedArea === area
                                    ? "bg-indigo-600 text-white font-medium"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Olympiads list */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">
                    Select an Olympiad
                    <span className="ml-2 text-gray-500 text-sm font-normal">
                        ({filteredOlympiads.length} available)
                    </span>
                </h2>
                
                {filteredOlympiads.length === 0 ? (
                    <p className="text-gray-500 py-4">No olympiads available for the selected filter.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {filteredOlympiads.map((olympiad) => (
                            <li key={olympiad.id} className="py-3">
                                <a 
                                    href={`/upload/olympiads/${olympiad.id}`}
                                    className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                                        {getAreaIcon(olympiad.area)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{olympiad.title}</h3>
                                        <p className="text-sm text-gray-500">{olympiad.area}</p>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// Helper function to get icon based on olympiad area
function getAreaIcon(area: string) {
    const subject = area.toLowerCase();
    
    if (subject.includes('math')) return <LuCalculator className="h-5 w-5 text-indigo-600" />;
    if (subject.includes('physics')) return <LuAtom className="h-5 w-5 text-indigo-600" />;
    if (subject.includes('chemistry')) return <LuFlaskConical className="h-5 w-5 text-indigo-600" />;
    if (subject.includes('biology')) return <LuMicroscope className="h-5 w-5 text-indigo-600" />;
    if (subject.includes('computer')) return <LuBraces className="h-5 w-5 text-indigo-600" />;
    if (subject.includes('economics')) return <LuActivity className="h-5 w-5 text-indigo-600" />;
    if (subject.includes('geography')) return <LuGlobe className="h-5 w-5 text-indigo-600" />;
    
    return <LuBrain className="h-5 w-5 text-indigo-600" />;
}