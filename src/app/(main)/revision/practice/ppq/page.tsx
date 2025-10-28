"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from '@/lib/components/Toast'
import { getVisibleYearGroups, isYearGroupVisible } from "@/lib/year-group-config"

interface Subject {
    id: number
    title: string
    level: number
}

export default function PPQPage() {
    const [name, setName] = useState("")
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedLevel, setSelectedLevel] = useState(0) // Default to F3 (level 0)
    const [isSpecimen, setIsSpecimen] = useState(true)
    const [startYear, setStartYear] = useState(2015)
    const [endYear, setEndYear] = useState(new Date().getFullYear())
    const [paperCount, setPaperCount] = useState(3)
    const [maxMarks, setMaxMarks] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [currentYear] = useState(new Date().getFullYear())

    // Year group labels - use dynamic configuration
    const yearGroups = getVisibleYearGroups().map(group => ({
        level: group.level,
        label: group.name
    }))

    useEffect(() => {
        // Fetch subjects from the API
        const fetchSubjects = async () => {
            try {
                const response = await fetch("/api/subjects")
                const data = await response.json()
                
                // Filter subjects to only include those from visible year groups
                const visibleSubjects = data.filter(subject => isYearGroupVisible(subject.level))
                setSubjects(visibleSubjects)
                
                // Filter subjects for the initial selected level
                const filteredSubjects = visibleSubjects.filter(subject => subject.level === selectedLevel)
                if (filteredSubjects.length > 0) {
                    setSelectedSubject(filteredSubjects[0].id.toString())
                } else if (visibleSubjects.length > 0) {
                    setSelectedSubject(visibleSubjects[0].id.toString())
                }
            } catch (error) {
                console.error("Error fetching subjects:", error)
            }
        }

        fetchSubjects()
    }, [selectedLevel])

    // Handle year group change
    const handleLevelChange = (level: number) => {
        setSelectedLevel(level)
        
        // Reset selected subject if no subjects available for this level
        const filteredSubjects = subjects.filter(subject => subject.level === level)
        if (filteredSubjects.length > 0) {
            setSelectedSubject(filteredSubjects[0].id.toString())
        } else {
            setSelectedSubject("")
        }
    }

    // Get subjects filtered by current level
    const filteredSubjects = subjects.filter(subject => subject.level === selectedLevel)

    // Update maxMarks array when paperCount changes
    useEffect(() => {
        setMaxMarks(oldMaxMarks => {
            const newMaxMarks = [...oldMaxMarks];
        
            while (newMaxMarks.length < paperCount) {
                newMaxMarks.push(100); // Default max mark
            }
            
            if (newMaxMarks.length > paperCount) {
                newMaxMarks.length = paperCount;
            }

            if (JSON.stringify(oldMaxMarks) === JSON.stringify(newMaxMarks)) {
                return oldMaxMarks;
            }
            
            return newMaxMarks;
        });
    }, [paperCount]);

    const updateMaxMark = (paperIndex: number, value: number) => {
        const newMaxMarks = [...maxMarks];
        newMaxMarks[paperIndex] = value;
        setMaxMarks(newMaxMarks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Calculate years excluding current year
            const yearCount = isSpecimen ? 
                (endYear - startYear) + 1 :  // +1 for specimen, but exclude current year
                (endYear - startYear);       // exclude current year
                
            const response = await fetch("/api/pastpaper-records", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    subjectId: parseInt(selectedSubject),
                    specimen: isSpecimen,
                    startYear: parseInt(startYear.toString()),
                    endYear: parseInt(endYear.toString()),
                    paperCount: parseInt(paperCount.toString()),
                    max_marks: maxMarks,
                    yearCount: yearCount, // Let the server know how many years we're considering
                }),
            })

            if (response.ok) {
                toast.success("Your past paper record has been created successfully!")
                router.push("/revision/practice/ppq/records")
            } else {
                const error = await response.json()
                throw new Error(error.message || "Something went wrong")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Create Past Paper Record</h1>
                    <Link href="/revision/practice/ppq/records"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        View Records
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Record Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Biology 2023 Papers"
                                required
                                className="w-full p-2 border rounded-md bg-background border-input"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Year Group</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {yearGroups.map(group => (
                                    <button
                                        key={group.level}
                                        type="button"
                                        onClick={() => handleLevelChange(group.level)}
                                        className={`p-2 rounded-md ${
                                            selectedLevel === group.level 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted hover:bg-accent'
                                        }`}
                                    >
                                        {group.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            {filteredSubjects.length > 0 ? (
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full p-2 border rounded-md bg-background border-input"
                                    required
                                >
                                    {filteredSubjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.title}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-yellow-500 p-2 border border-yellow-500/20 bg-yellow-500/10 rounded-md">
                                    No subjects available for this year group. Please select a different year group.
                                </p>
                            )}
                        </div>

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                checked={isSpecimen}
                                onChange={(e) => setIsSpecimen(e.target.checked)}
                                id="specimen"
                                className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                            />
                            <label htmlFor="specimen" className="ml-2 text-sm font-medium">
                                Include Specimen Papers
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Start Year</label>
                            <input
                                type="number"
                                value={startYear}
                                onChange={(e) => setStartYear(parseInt(e.target.value))}
                                min="2000"
                                max={endYear}
                                required
                                className="w-full p-2 border rounded-md bg-background border-input"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">End Year</label>
                            <input
                                type="number"
                                value={endYear}
                                onChange={(e) => setEndYear(parseInt(e.target.value))}
                                min={startYear}
                                max={currentYear}
                                required
                                className="w-full p-2 border rounded-md bg-background border-input"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1">Number of Papers per Year</label>
                            <div className="flex items-center">
                                <button 
                                    type="button"
                                    onClick={() => setPaperCount(Math.max(1, paperCount - 1))}
                                    className="px-3 py-2 bg-muted border border-input rounded-l-md hover:bg-accent focus:outline-none"
                                    aria-label="Decrease paper count"
                                >
                                    <span className="text-lg">−</span>
                                </button>
                                <input
                                    type="number"
                                    value={paperCount}
                                    onChange={(e) => setPaperCount(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="10"
                                    required
                                    className="w-16 text-center p-2 border-y border-input bg-background focus:outline-none focus:ring-ring"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setPaperCount(Math.min(10, paperCount + 1))}
                                    className="px-3 py-2 bg-muted border border-input rounded-r-md hover:bg-accent focus:outline-none"
                                    aria-label="Increase paper count"
                                >
                                    <span className="text-lg">+</span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-4">Maximum Marks for Each Paper</label>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted">
                                        <tr>
                                            {Array.from({ length: paperCount }).map((_, i) => (
                                                <th key={i} scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Paper {i + 1}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-card divide-y divide-border">
                                        <tr className="hover:bg-accent">
                                            {Array.from({ length: paperCount }).map((_, paperNum) => (
                                                <td key={paperNum} className="px-4 py-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateMaxMark(paperNum, Math.max(1, (maxMarks[paperNum] || 100) - 5))}
                                                            className="px-2 py-1 bg-muted border border-input rounded-l-md hover:bg-accent focus:outline-none"
                                                            aria-label={`Decrease max mark for paper ${paperNum + 1}`}
                                                        >
                                                            <span className="text-sm">−</span>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={maxMarks[paperNum] || 100}
                                                            onChange={(e) => updateMaxMark(paperNum, parseInt(e.target.value) || 1)}
                                                            min="1"
                                                            required
                                                            className="w-16 text-center p-1 text-sm border-y border-input bg-background focus:outline-none focus:ring-ring"
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => updateMaxMark(paperNum, Math.min(999, (maxMarks[paperNum] || 100) + 5))}
                                                            className="px-2 py-1 bg-muted border border-input rounded-r-md hover:bg-accent focus:outline-none"
                                                            aria-label={`Increase max mark for paper ${paperNum + 1}`}
                                                        >
                                                            <span className="text-sm">+</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Record"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
