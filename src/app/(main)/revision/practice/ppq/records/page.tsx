"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Subject {
  id: number
  title: string
}

interface PastPaperRecord {
  id: string
  name: string
  userId: string
  subjectId: number
  subject: Subject
  specimen: boolean
  start_year: number
  end_year: number
  paper_count: number
  papers_finished: number[]
  paper_marks: number[]
  max_marks: number[]
}

export default function PPQRecordsPage() {
  const [records, setRecords] = useState<PastPaperRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)

  // Extract unique subjects from records
  const subjects = Array.from(new Set(records.map(record => record.subject?.title || "Unknown")))
    .map(title => {
      const record = records.find(r => r.subject?.title === title)
      return { id: record?.subjectId || 0, title }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("/api/pastpaper-records")
        const data = await response.json()
        setRecords(data)
      } catch (error) {
        console.error("Error fetching records:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const deleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      const response = await fetch(`/api/pastpaper-records/${recordId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRecords(records.filter(record => record.id !== recordId))
      }
    } catch (error) {
      console.error("Error deleting record:", error)
    }
  }

  // Filter records based on search term and selected subject
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subject?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === null || record.subjectId === selectedSubject
    return matchesSearch && matchesSubject
  })

  // Calculate average performance for a record
  const getAveragePerformance = (record: PastPaperRecord) => {
    if (!record.paper_marks || !record.max_marks || record.paper_marks.length === 0) {
      return { percentage: 0, marksDisplay: "" }
    }

    let totalMarks = 0
    let totalMaxMarks = 0
    let validEntries = 0

    // For each paper with marks, calculate total
    record.paper_marks.forEach((mark, index) => {
      // Get the corresponding max mark
      const maxMark = record.max_marks[index % record.paper_count]
      // Include 0 marks in calculation - only check that maxMark is valid
      if (maxMark > 0) {
        totalMarks += mark
        totalMaxMarks += maxMark
        validEntries++
      }
    })

    if (validEntries === 0) return { percentage: 0, marksDisplay: "" }

    const percentage = Math.round((totalMarks / totalMaxMarks) * 100)
    const marksDisplay = `${totalMarks}/${totalMaxMarks}`

    return { percentage, marksDisplay }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Past Paper Records</h1>
        <Link href="/revision/practice/ppq"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Record
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10 mb-2"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-4"></div>
            <span className="text-gray-500 dark:text-gray-400">Loading records...</span>
          </div>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-4">No Records Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven&apos;t created any past paper records yet. Create your first record to start tracking your progress.
          </p>
          <Link href="/revision/practice/ppq"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Your First Record
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="searchRecords" className="sr-only">Search records</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="searchRecords"
                    type="text"
                    placeholder="Search records by name or subject"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="filterSubject" className="sr-only">Filter by subject</label>
                <select
                  id="filterSubject"
                  value={selectedSubject === null ? "" : selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full sm:w-auto rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map(record => {
              const { percentage, marksDisplay } = getAveragePerformance(record)
              // Calculate completion percentage excluding current year
              const totalPaperCount = record.paper_count * (record.specimen ?
                (new Date().getFullYear() - record.start_year + 1) : // +1 for specimen
                (new Date().getFullYear() - record.start_year)) // no current year
              const completionPercentage = (record.papers_finished.length / totalPaperCount) * 100

              // Determine color based on performance
              const performanceColor =
                percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                  percentage >= 60 ? 'text-blue-600 dark:text-blue-400' :
                    percentage >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400';

              return (
                <div key={record.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold line-clamp-1">{record.name}</h2>
                      <div className="flex space-x-1">
                        <Link
                          href={`/revision/practice/ppq/records/${record.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Edit record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Delete record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        {record.subject?.title || "Unknown Subject"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {record.start_year} to {record.end_year} • {record.specimen ? "With" : "Without"} Specimen
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {/* Completion Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Completion</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {record.papers_finished.length} of {totalPaperCount} papers
                          </span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-500"
                            style={{ width: `${Math.min(100, Math.max(0, completionPercentage))}%` }}
                          />
                        </div>
                      </div>

                      {/* Performance Progress */}
                      {marksDisplay && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Average Score</span>
                            <span className={`text-xs font-medium ${performanceColor}`}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute top-0 left-0 h-full ${percentage >= 80 ? 'bg-green-500' :
                                  percentage >= 60 ? 'bg-blue-500' :
                                    percentage >= 40 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                }`}
                              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/revision/practice/ppq/records/${record.id}`}
                      className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View & Edit Record
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredRecords.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No matching records found</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 