"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast, ToastContainer } from "@/components/Toast"

interface Subject {
  id: number
  title: string
}

interface PaperData {
  id: number; // 6-digit integer: yearPaper (e.g., 202301 for year 2023, paper 1)
  completed: boolean;
  mark?: number;
}

interface PastPaperRecord {
  id: string
  name: string
  userId: string
  subjectId: number
  subject: Subject
  specimen: boolean
  start_year: number
  paper_count: number
  papers_finished: number[] // Array of 6-digit paper IDs
  paper_marks: number[]
  max_marks: number[]
}

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>()
  const [record, setRecord] = useState<PastPaperRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [paperData, setPaperData] = useState<PaperData[]>([])
  const [saving, setSaving] = useState(false)
  const currentYear = new Date().getFullYear()

  // Generate a paper ID from year and paper number (e.g., 2023 and 1 => 202301)
  const generatePaperId = (year: string | number, paperNum: number): number => {
    // For specimen papers, use 999900 + paperNum
    if (year === "specimen" || year === "Specimen") {
      return 999900 + paperNum;
    }
    // For normal years, use year * 100 + paperNum
    return parseInt(year.toString()) * 100 + paperNum;
  };

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        if (!params || !params.id) return;
        
        const response = await fetch(`/api/pastpaper-records/${params.id}`)
        const data = await response.json()
        setRecord(data)

        // Initialize paper data from record
        const papers: PaperData[] = []
        const years = data.specimen ? 
          ["specimen", ...Array.from({ length: currentYear - data.start_year + 1 }, (_, i) => (data.start_year + i).toString())] :
          Array.from({ length: currentYear - data.start_year + 1 }, (_, i) => (data.start_year + i).toString())

        // For each year and paper, create a paper data entry
        years.forEach((year) => {
          for (let paperNum = 1; paperNum <= data.paper_count; paperNum++) {
            const paperId = generatePaperId(year, paperNum);
            const paperFinishedIndex = data.papers_finished.indexOf(paperId);
            
            papers.push({
              id: paperId,
              completed: paperFinishedIndex !== -1,
              // Only set mark if the paper is in the papers_finished array and has a corresponding mark
              mark: paperFinishedIndex !== -1 && paperFinishedIndex < data.paper_marks.length ? 
                data.paper_marks[paperFinishedIndex] : undefined
            })
          }
        })
        
        setPaperData(papers)
      } catch (error) {
        console.error("Error fetching record:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params && params.id) {
      fetchRecord()
    } else {
      setLoading(false)
    }
  }, [params?.id, currentYear])

  const togglePaperStatus = (paperId: number) => {
    setPaperData(currentData => 
      currentData.map(paper => 
        paper.id === paperId ? { ...paper, completed: !paper.completed } : paper
      )
    )
  }

  const updatePaperMark = (paperId: number, mark: number | undefined) => {
    setPaperData(currentData => 
      currentData.map(paper => {
        if (paper.id === paperId) {
          // Find the paper index to get the maximum mark
          const paperIndex = (paper.id % 100) - 1;
          const maxMark = record?.max_marks[paperIndex] || 0;
          
          // Handle undefined mark (empty input)
          if (mark === undefined) {
            return { ...paper, mark: undefined };
          }
          
          // Ensure mark is between 0 and maxMark
          const validatedMark = Math.min(Math.max(0, mark), maxMark);
          
          return { ...paper, mark: validatedMark };
        }
        return paper;
      })
    )
  }

  // Calculate average score for display
  const calculateAverageScore = () => {
    if (!paperData.length || !record) return { percentage: 0, totalMarks: 0, totalMaxMarks: 0 };
    
    let totalMarks = 0;
    let totalMaxMarks = 0;
    
    // Include papers that have been completed and have actual marks (including 0, excluding undefined)
    paperData.forEach(paper => {
      if (paper.completed && paper.mark !== undefined) {
        const paperIndex = (paper.id % 100) - 1;
        const maxMark = record.max_marks[paperIndex] || 0;
        if (maxMark > 0) {
          // Include scores of 0 in the calculation
          totalMarks += paper.mark; // paper.mark can be 0 here, and that's okay!
          totalMaxMarks += maxMark;
        }
      }
    });
    
    if (totalMaxMarks === 0) return { percentage: 0, totalMarks: 0, totalMaxMarks: 0 };
    
    return {
      percentage: Math.round((totalMarks / totalMaxMarks) * 100),
      totalMarks,
      totalMaxMarks
    };
  };

  const saveChanges = async () => {
    if (!record) return
    setSaving(true)

    try {
      // Prepare arrays for the API call
      const papers_finished: number[] = [];
      const paper_marks: (number | null)[] = [];
      
      // Add all completed papers and their marks to the arrays
      // matching indices between papers_finished and paper_marks
      paperData.forEach(paper => {
        if (paper.completed) {
          papers_finished.push(paper.id);
          
          // Only include marks that have been set (including 0)
          // If mark is undefined (blank), use null to indicate "no mark"
          paper_marks.push(paper.mark ?? null);
        }
      });
      
      const response = await fetch(`/api/pastpaper-records/${record.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          papers_finished,
          paper_marks,
        }),
      })

      if (response.ok) {
        toast.success("Your progress has been saved successfully!")
      } else {
        throw new Error("Failed to save progress")
      }
    } catch (error) {
      console.error("Error saving progress:", error)
      toast.error("Error saving progress. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10 mb-2"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-4"></div>
            <span className="text-gray-500 dark:text-gray-400">Loading record...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center max-w-xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold mb-4">Record not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn&apos;t find the record you were looking for.
          </p>
          <Link href="/revision/practice/ppq/records" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Back to Records
          </Link>
        </div>
      </div>
    )
  }

  // Calculate years from start_year to current year (plus specimen if included)
  const years: string[] = []
  if (record.specimen) {
    years.push("Specimen")
  }
  
  for (let year = record.start_year; year <= currentYear; year++) {
    years.push(year.toString())
  }

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/revision/practice/ppq/records" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Records
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold">{record.name}</h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                {record.subject?.title || "Unknown Subject"}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {record.start_year} to present • {record.specimen ? "With Specimen" : "Without Specimen"}
              </div>
            </div>
            
            {/* Display average score */}
            {(() => {
              const { percentage } = calculateAverageScore();
              const totalMaxMarks = calculateAverageScore().totalMaxMarks;
              
              if (totalMaxMarks > 0) {
                // Determine color based on performance
                const scoreColor = 
                  percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  percentage >= 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  percentage >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
                
                return (
                  <div className="mt-4 flex items-center">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${scoreColor}`}>
                      Average: {percentage}%
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Paper Progress</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Year
                    </th>
                    {Array.from({ length: record.paper_count }).map((_, i) => (
                      <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Paper {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {years.map((year) => {
                    return (
                      <tr key={year} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {year}
                        </td>
                        {Array.from({ length: record.paper_count }).map((_, paperIndex) => {
                          const paperNum = paperIndex + 1;
                          const paperId = generatePaperId(year, paperNum);
                          const paper = paperData.find(p => p.id === paperId);
                          
                          // Get the max mark for this paper number
                          const paperMaxMark = record.max_marks[paperIndex] || 0;
                          
                          if (!paper) return (
                            <td key={paperNum} className="px-6 py-4 whitespace-nowrap text-gray-400 dark:text-gray-500">
                              No data
                            </td>
                          );
                          
                          return (
                            <td key={paperNum} className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col items-start space-y-2">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={paper.completed}
                                    onChange={() => togglePaperStatus(paperId)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm font-medium">Completed</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    value={paper.mark === undefined ? "" : paper.mark}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      // Handle empty string (blank entry)
                                      if (inputValue === "") {
                                        updatePaperMark(paperId, undefined);
                                      } 
                                      // Handle valid numbers (including 0)
                                      else if (!isNaN(parseInt(inputValue))) {
                                        updatePaperMark(paperId, parseInt(inputValue));
                                      }
                                    }}
                                    onBlur={(e) => {
                                      // Validate on blur to ensure the display reflects the actual stored value
                                      const inputValue = e.target.value === "" ? 0 : parseInt(e.target.value);
                                      const paperIndex = (paperId % 100) - 1;
                                      const maxMark = record.max_marks[paperIndex] || 0;
                                      const validValue = Math.min(Math.max(0, inputValue), maxMark);
                                      
                                      // If the value is invalid, update the input to show the valid value
                                      if (inputValue !== validValue) {
                                        updatePaperMark(paperId, validValue);
                                      }
                                    }}
                                    placeholder="Mark"
                                    min="0"
                                    max={paperMaxMark}
                                    className="w-16 p-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <span className="text-sm">/</span>
                                  <span className="w-16 p-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
                                    {paperMaxMark || 0}
                                  </span>
                                </div>
                                
                                {paperMaxMark > 0 && paper.mark !== undefined && (
                                  <div className="text-sm">
                                    {Math.round((paper.mark / paperMaxMark) * 100)}%
                                  </div>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                onClick={saveChanges}
                disabled={saving}
                className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : "Save Progress"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
