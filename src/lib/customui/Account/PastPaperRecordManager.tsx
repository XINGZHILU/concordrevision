'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import {
  LuClipboard,
  LuCalendar,
  LuEye,
  LuPencil,
  LuSearch,
  LuX,
  LuRefreshCw,
  LuFileText,
  LuCheck,
  LuTrendingUp,
} from 'react-icons/lu';
import { getYearGroupName } from '@/lib/year-group-config';

interface Subject {
  id: number;
  title: string;
  level: number;
}

interface PastPaperRecord {
  id: string;
  name: string;
  subject: Subject;
  specimen: boolean;
  start_year: number;
  end_year: number;
  paper_count: number;
  papers_finished: number[];
  paper_marks: number[];
  max_marks: number[];
  notes: string;
}

interface PastPaperRecordManagerProps {
  userId: string;
}

/**
 * Component to manage user's past paper records
 */
const PastPaperRecordManager: React.FC<PastPaperRecordManagerProps> = ({ userId }) => {
  const [records, setRecords] = useState<PastPaperRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pastpaper-records');

      if (!response.ok) {
        throw new Error('Failed to fetch past paper records');
      }

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error('Error fetching past paper records:', err);
      setError('Failed to load past paper records');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter records based on search query
   */
  const filterRecords = (recordList: PastPaperRecord[]): PastPaperRecord[] => {
    if (!searchQuery.trim()) return recordList;

    return recordList.filter(record => {
      const searchLower = searchQuery.toLowerCase();

      // Search in name
      if (record.name.toLowerCase().includes(searchLower)) return true;

      // Search in subject
      if (record.subject?.title?.toLowerCase().includes(searchLower)) return true;

      // Search in notes
      if (record.notes?.toLowerCase().includes(searchLower)) return true;

      return false;
    });
  };

  /**
   * Calculate completion percentage
   */
  const getCompletionPercentage = (record: PastPaperRecord): number => {
    const totalPapers = (record.end_year - record.start_year + 1) * record.paper_count + (record.specimen ? record.paper_count : 0);
    const finishedPapers = record.papers_finished.length;
    return totalPapers > 0 ? Math.round((finishedPapers / totalPapers) * 100) : 0;
  };

  /**
   * Calculate average score
   */
  const getAverageScore = (record: PastPaperRecord): string => {
    if (record.paper_marks.length === 0) return 'N/A';
    
    let totalPercentage = 0;
    let validScores = 0;

    record.paper_marks.forEach((mark, index) => {
      const maxMark = record.max_marks[index];
      if (maxMark && maxMark > 0) {
        totalPercentage += (mark / maxMark) * 100;
        validScores++;
      }
    });

    return validScores > 0 ? `${Math.round(totalPercentage / validScores)}%` : 'N/A';
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Render record card
   */
  const renderRecordCard = (record: PastPaperRecord) => {
    const completionPercentage = getCompletionPercentage(record);
    const averageScore = getAverageScore(record);

    return (
      <div
        key={record.id}
        className="bg-card border border-border rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="text-primary flex-shrink-0">
              <LuClipboard className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground break-words">
                {record.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                Past Paper Record
              </p>
            </div>
          </div>

          {/* Completion badge */}
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
            {completionPercentage}% Complete
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-4 overflow-hidden space-y-2">
          <p className="text-sm text-muted-foreground truncate">
            {getYearGroupName(record.subject.level)} {record.subject.title}
          </p>

          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline" className="flex items-center gap-1">
              <LuCalendar className="h-3 w-3" />
              {record.start_year} - {record.end_year}
            </Badge>
            {record.specimen && (
              <Badge variant="outline">
                Specimen Papers
              </Badge>
            )}
            <Badge variant="outline">
              {record.paper_count} Paper{record.paper_count !== 1 ? 's' : ''}/Year
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs">
                <LuCheck className="h-3 w-3" />
                Papers Done
              </div>
              <p className="font-semibold text-foreground">
                {record.papers_finished.length}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs">
                <LuTrendingUp className="h-3 w-3" />
                Avg Score
              </div>
              <p className="font-semibold text-foreground">
                {averageScore}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {record.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
              {record.notes}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Link href={`/revision/practice/ppq/records/${record.id}`}>
            <Button variant="outline" size="sm">
              <LuEye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>

          <Link href={`/revision/practice/ppq/records/${record.id}`}>
            <Button variant="outline" size="sm">
              <LuPencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <LuRefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12 px-4">
          <p className="text-destructive mb-4 break-words">{error}</p>
          <Button onClick={fetchRecords} variant="outline">
            <LuRefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const filteredRecords = filterRecords(records);
  const totalPapersFinished = records.reduce((sum, r) => sum + r.papers_finished.length, 0);
  const avgCompletion = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + getCompletionPercentage(r), 0) / records.length)
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Past Paper Records</h2>
        <p className="text-muted-foreground">
          Track your progress on past papers and specimen papers
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuClipboard className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground truncate">{records.length}</p>
              <p className="text-sm text-muted-foreground whitespace-nowrap">Total Records</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuCheck className="h-8 w-8 text-success flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground truncate">{totalPapersFinished}</p>
              <p className="text-sm text-muted-foreground whitespace-nowrap">Papers Done</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuTrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground truncate">{avgCompletion}%</p>
              <p className="text-sm text-muted-foreground whitespace-nowrap">Avg Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LuSearch className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="block w-full pl-9 pr-8 py-2 border border-input bg-background rounded-lg text-sm focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <LuX className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground truncate">
            Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
          </p>
        )}
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 px-4">
          <LuClipboard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2 break-words">
            {searchQuery ? `No records found for "${searchQuery}"` : 'No past paper records found'}
          </p>
          {!searchQuery && (
            <Link href="/revision/practice/ppq">
              <Button>
                <LuFileText className="h-4 w-4 mr-2" />
                Create Record
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
          {filteredRecords.map(renderRecordCard)}
        </div>
      )}
    </div>
  );
};

export default PastPaperRecordManager;

