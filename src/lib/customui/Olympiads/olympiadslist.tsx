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
    LuFilter,
    LuBook
} from "react-icons/lu";

// Pagination Component
function Pagination({ totalPages, currentPage, onPageChange }: { totalPages: number, currentPage: number, onPageChange: (page: number) => void }) {
    return (
        <div className="flex justify-center items-center space-x-2 mt-10">
            {currentPage > 1 && (
                <button onClick={() => onPageChange(currentPage - 1)} className="px-4 py-2 border rounded-md hover:bg-accent">
                    Previous
                </button>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 border rounded-md ${currentPage === page ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                >
                    {page}
                </button>
            ))}

            {currentPage < totalPages && (
                <button onClick={() => onPageChange(currentPage + 1)} className="px-4 py-2 border rounded-md hover:bg-accent">
                    Next
                </button>
            )}
        </div>
    );
}

export default function OlympiadsList({ olympiads }: {
    olympiads: {
        id: number,
        title: string,
        desc: string,
        area: string,
    }[]
}) {
    const [selectedArea, setSelectedArea] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const getAreaIcon = (area: string) => {
        const subject = area.toLowerCase();

        if (subject.includes('math')) return <LuCalculator className="mr-2 h-5 w-5" />;
        if (subject.includes('physics')) return <LuAtom className="mr-2 h-5 w-5" />;
        if (subject.includes('chemistry')) return <LuFlaskConical className="mr-2 h-5 w-5" />;
        if (subject.includes('biology')) return <LuMicroscope className="mr-2 h-5 w-5" />;
        if (subject.includes('computer')) return <LuBraces className="mr-2 h-5 w-5" />;
        if (subject.includes('humanities')) return <LuBook className="mr-2 h-5 w-5" />;
        if (subject.includes('geography')) return <LuGlobe className="mr-2 h-5 w-5" />;

        return <LuBrain className="mr-2 h-5 w-5" />;
    };

    const filteredOlympiads = olympiads.filter((olympiad) => {
        const matchesArea = selectedArea === "All" || olympiad.area === selectedArea;
        const matchesSearch = searchQuery === "" ||
            olympiad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            olympiad.desc.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesArea && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOlympiads.length / itemsPerPage);
    const paginatedOlympiads = filteredOlympiads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAreaChange = (area: string) => {
        setSelectedArea(area);
        setCurrentPage(1);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-foreground">Academic Olympiads</h1>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Explore international competitions, preparation materials, and resources for academic olympiads
                </p>
            </div>

            <div className="bg-card rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LuSearch className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 w-full border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring"
                            placeholder="Search olympiads..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <LuFilter className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
                        <button
                            onClick={() => handleAreaChange("All")}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedArea === "All"
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                }`}
                        >
                            All
                        </button>
                        {olympiad_subjects.map((area) => (
                            <button
                                key={area}
                                onClick={() => handleAreaChange(area)}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center ${selectedArea === area
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "bg-muted text-muted-foreground hover:bg-accent"
                                    }`}
                            >
                                {getAreaIcon(area)}
                                {area}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            
                <h2 className="text-xl font-semibold text-foreground">
                    {selectedArea === "All" ? "All Olympiads" : selectedArea + " Olympiads"}
                    <span className="ml-2 text-muted-foreground text-base font-normal">
                        ({filteredOlympiads.length} {filteredOlympiads.length === 1 ? 'competition' : 'competitions'})
                    </span>
                </h2>
            

            {paginatedOlympiads.length === 0 ? (
                <div className="bg-muted border border-border rounded-lg p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
                        <LuBrain className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No olympiads found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        {searchQuery
                            ? `No results matching "${searchQuery}". Try another search term or select a different subject area.`
                            : `No olympiads available for ${selectedArea}. Try selecting a different subject area.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedOlympiads.map((olympiad) => (
                        <OlympiadCard key={olympiad.id} olympiad={olympiad} />
                    ))}
                </div>
            )}
            {totalPages > 1 && (
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
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
                <h1 className="text-2xl font-bold text-foreground">Upload Olympiad Resources</h1>
                <p className="mt-2 text-muted-foreground">
                    Select an olympiad to upload competition materials or resources
                </p>
            </div>

            {/* Filter by subject area */}
            <div className="mb-8 bg-card rounded-lg shadow-sm p-4 border border-border">
                <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Filter by subject:</span>
                    <button
                        onClick={() => setSelectedArea("All")}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedArea === "All"
                                ? "bg-primary text-primary-foreground font-medium"
                                : "bg-muted text-muted-foreground hover:bg-accent"
                            }`}
                    >
                        All
                    </button>

                    {olympiad_subjects.map((area) => (
                        <button
                            key={area}
                            onClick={() => setSelectedArea(area)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${selectedArea === area
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                }`}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            {/* Olympiads list */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <h2 className="text-lg font-medium mb-4">
                    Select an Olympiad
                    <span className="ml-2 text-muted-foreground text-sm font-normal">
                        ({filteredOlympiads.length} available)
                    </span>
                </h2>

                {filteredOlympiads.length === 0 ? (
                    <p className="text-muted-foreground py-4">No olympiads available for the selected filter.</p>
                ) : (
                    <ul className="divide-y divide-border !list-none">
                        {filteredOlympiads.map((olympiad) => (
                            <li key={olympiad.id} className="py-3">
                                <a
                                    href={`/upload/olympiads/${olympiad.id}`}
                                    className="flex items-center hover:bg-accent p-2 rounded-lg transition-colors"
                                >
                                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                                        {getAreaIcon(olympiad.area)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">{olympiad.title}</h3>
                                        <p className="text-sm text-muted-foreground">{olympiad.area}</p>
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

    if (subject.includes('math')) return <LuCalculator className="mr-2 h-5 w-5 text-muted-foreground" />;
    if (subject.includes('physics')) return <LuAtom className="mr-2 h-5 w-5 text-muted-foreground" />;
    if (subject.includes('chemistry')) return <LuFlaskConical className="mr-2 h-5 w-5 text-muted-foreground" />;
    if (subject.includes('biology')) return <LuMicroscope className="mr-2 h-5 w-5 text-muted-foreground" />;
    if (subject.includes('computer')) return <LuBraces className="mr-2 h-5 w-5 text-muted-foreground" />;
    if (subject.includes('humanities')) return <LuBook className="mr-2 h-5 w-5 text-muted-foreground" />;
    if (subject.includes('geography')) return <LuGlobe className="mr-2 h-5 w-5 text-muted-foreground" />;

    return <LuBrain className="mr-2 h-5 w-5 text-muted-foreground" />;
}