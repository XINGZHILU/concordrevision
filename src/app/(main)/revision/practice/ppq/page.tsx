"use client";

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "@/components/Toast"

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
    const [paperCount, setPaperCount] = useState(3)
    const [maxMarks, setMaxMarks] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [currentYear] = useState(new Date().getFullYear())

    // Year group labels
    const yearGroups = [
        { level: 0, label: "Form 3" },
        { level: 1, label: "Form 4" },
        { level: 2, label: "Form 5" },
        { level: 3, label: "6.1" },
        { level: 4, label: "6.2" }
    ]

    useEffect(() => {
        // Fetch subjects from the API
        const fetchSubjects = async () => {
            try {
                const response = await fetch("/api/subjects")
                const data = await response.json()
                setSubjects(data)
                
                // Filter subjects for the initial selected level
                const filteredSubjects = data.filter(subject => subject.level === selectedLevel)
                if (filteredSubjects.length > 0) {
                    setSelectedSubject(filteredSubjects[0].id.toString())
                } else if (data.length > 0) {
                    setSelectedSubject(data[0].id.toString())
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
        // Initialize or resize the maxMarks array based on paper count only (not years)
        const newMaxMarks = [...maxMarks];
        
        while (newMaxMarks.length < paperCount) {
            newMaxMarks.push(100); // Default max mark
        }
        
        if (newMaxMarks.length > paperCount) {
            newMaxMarks.length = paperCount;
        }
        
        setMaxMarks(newMaxMarks);
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
                (currentYear - startYear) + 1 :  // +1 for specimen, but exclude current year
                (currentYear - startYear);       // exclude current year
                
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
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        View Records
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Record Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Biology 2023 Papers"
                                required
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    {filteredSubjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.title}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-yellow-600 dark:text-yellow-400 p-2 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900 bg-opacity-30 rounded-md">
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
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                                max={currentYear}
                                required
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1">Number of Papers per Year</label>
                            <div className="flex items-center">
                                <button 
                                    type="button"
                                    onClick={() => setPaperCount(Math.max(1, paperCount - 1))}
                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
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
                                    className="w-16 text-center p-2 border-y border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setPaperCount(Math.min(10, paperCount + 1))}
                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                                    aria-label="Increase paper count"
                                >
                                    <span className="text-lg">+</span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-4">Maximum Marks for Each Paper</label>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            {Array.from({ length: paperCount }).map((_, i) => (
                                                <th key={i} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Paper {i + 1}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            {Array.from({ length: paperCount }).map((_, paperNum) => (
                                                <td key={paperNum} className="px-4 py-2 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        value={maxMarks[paperNum] || 100}
                                                        onChange={(e) => updateMaxMark(paperNum, parseInt(e.target.value) || 100)}
                                                        min="1"
                                                        required
                                                        className="w-16 p-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
