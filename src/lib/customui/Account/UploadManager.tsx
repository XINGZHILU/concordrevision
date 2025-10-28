'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs'
import { 
  LuFileText, 
  LuTrophy, 
  LuGraduationCap, 
  LuClipboard, 
  LuCalendar, 
  LuCheck, 
  LuClock, 
  LuEye,
  LuPencil,
  LuSearch,
  LuX,
  LuActivity,
  LuRefreshCw
} from 'react-icons/lu';
import { getYearGroupName } from '@/lib/year-group-config';

interface UploadFile {
  id: number;
  filename: string;
  type: string;
}

interface Subject {
  id: number;
  title: string;
  level: number;
}

interface Test {
  id: number;
  title: string;
}

interface Olympiad {
  id: number;
  title: string;
  area: string;
}

interface BaseUpload {
  id: number;
  title: string;
  desc: string;
  approved: boolean;
  pinned: boolean;
  uploadedAt: string;
  files: UploadFile[];
  fileCount: number;
}

interface Note extends BaseUpload {
  uploadType: 'note';
  subject: Subject;
  test?: Test;
  type: number;
}

interface OlympiadResource extends BaseUpload {
  uploadType: 'olympiad_resource';
  olympiad: Olympiad;
  type: number;
}

interface UCASPost extends BaseUpload {
  uploadType: 'ucas_post';
  content: string;
  type: number;
  tags: string[];
  universities: string[];
  courses: string[];
}

interface PastPaperRecord {
  id: string;
  uploadType: 'past_paper_record';
  name: string;
  title?: string; // Add optional title property for consistency
  subject: Subject;
  specimen: boolean;
  start_year: number;
  end_year: number;
  paper_count: number;
  papers_finished: number[];
  paper_marks: number[];
  max_marks: number[];
  notes: string;
  fileCount: number;
}

type Upload = Note | OlympiadResource | UCASPost | PastPaperRecord;

interface UploadsData {
  notes: Note[];
  olympiadResources: OlympiadResource[];
  ucasPosts: UCASPost[];
  pastPaperRecords: PastPaperRecord[];
}

interface Summary {
  totalUploads: number;
  approvedUploads: number;
  pendingUploads: number;
  totalFiles: number;
}

interface UploadManagerProps {
  userId: string;
}

/**
 * Component to manage all user uploads across different types
 */
const UploadManager: React.FC<UploadManagerProps> = ({ userId }) => {
  const [uploads, setUploads] = useState<UploadsData>({
    notes: [],
    olympiadResources: [],
    ucasPosts: [],
    pastPaperRecords: [],
  });
  const [summary, setSummary] = useState<Summary>({
    totalUploads: 0,
    approvedUploads: 0,
    pendingUploads: 0,
    totalFiles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchUploads();
  }, [userId]);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/account/uploads');
      
      if (!response.ok) {
        throw new Error('Failed to fetch uploads');
      }

      const data = await response.json();
      setUploads(data.uploads);
      setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching uploads:', err);
      setError('Failed to load uploads');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all uploads as a flat array for filtering
   */
  const getAllUploads = (): Upload[] => {
    return [
      ...uploads.notes,
      ...uploads.olympiadResources,
      ...uploads.ucasPosts,
      ...uploads.pastPaperRecords,
    ];
  };

  /**
   * Get upload title (handles different upload types)
   */
  const getUploadTitle = (upload: Upload): string => {
    if ('title' in upload && upload.title) return upload.title;
    if ('name' in upload) return upload.name;
    return 'Untitled';
  };

  /**
   * Filter uploads based on search query
   */
  const filterUploads = (uploadList: Upload[]): Upload[] => {
    if (!searchQuery.trim()) return uploadList;
    
    return uploadList.filter(upload => {
      const searchLower = searchQuery.toLowerCase();
      const title = getUploadTitle(upload);
      
      // Search in title
      if (title.toLowerCase().includes(searchLower)) return true;
      
      // Search in description/content
      if ('desc' in upload && upload.desc?.toLowerCase().includes(searchLower)) return true;
      if ('content' in upload && upload.content?.toLowerCase().includes(searchLower)) return true;
      if ('notes' in upload && upload.notes?.toLowerCase().includes(searchLower)) return true;
      
      // Search in subject/olympiad/tags
      if ('subject' in upload && upload.subject?.title?.toLowerCase().includes(searchLower)) return true;
      if ('olympiad' in upload && upload.olympiad?.title?.toLowerCase().includes(searchLower)) return true;
      if ('tags' in upload && upload.tags?.some(tag => tag.toLowerCase().includes(searchLower))) return true;
      
      return false;
    });
  };

  /**
   * Get uploads for specific tab
   */
  const getTabUploads = (tab: string): Upload[] => {
    const allUploads = getAllUploads();
    
    switch (tab) {
      case 'notes':
        return filterUploads(uploads.notes);
      case 'olympiad':
        return filterUploads(uploads.olympiadResources);
      case 'ucas':
        return filterUploads(uploads.ucasPosts);
      case 'records':
        return filterUploads(uploads.pastPaperRecords);
      case 'approved':
        return filterUploads(allUploads.filter(u => 'approved' in u && u.approved));
      case 'pending':
        return filterUploads(allUploads.filter(u => 'approved' in u && !u.approved));
      default:
        return filterUploads(allUploads);
    }
  };

  /**
   * Get upload type icon
   */
  const getUploadIcon = (upload: Upload) => {
    switch (upload.uploadType) {
      case 'note':
        return <LuFileText className="h-5 w-5" />;
      case 'olympiad_resource':
        return <LuTrophy className="h-5 w-5" />;
      case 'ucas_post':
        return <LuGraduationCap className="h-5 w-5" />;
      case 'past_paper_record':
        return <LuClipboard className="h-5 w-5" />;
      default:
        return <LuFileText className="h-5 w-5" />;
    }
  };

  /**
   * Get upload type label
   */
  const getUploadTypeLabel = (upload: Upload): string => {
    switch (upload.uploadType) {
      case 'note':
        return 'Revision Note';
      case 'olympiad_resource':
        return 'Olympiad Resource';
      case 'ucas_post':
        return 'UCAS Post';
      case 'past_paper_record':
        return 'Past Paper Record';
      default:
        return 'Upload';
    }
  };

  /**
   * Get upload link
   */
  const getUploadLink = (upload: Upload): string => {
    switch (upload.uploadType) {
      case 'note':
        const note = upload as Note;
        if (note.test) {
          return `/revision/${note.subject.id}/tests/${note.test.id}/resources/${note.id}`;
        }
        return `/revision/${note.subject.id}/resources/${note.id}`;
      case 'olympiad_resource':
        const resource = upload as OlympiadResource;
        return `/olympiads/${resource.olympiad.id}/resources/${resource.id}`;
      case 'ucas_post':
        return `/ucas/posts/${upload.id}`;
      case 'past_paper_record':
        return `/revision/practice/ppq/records/${upload.id}`;
      default:
        return '#';
    }
  };

  /**
   * Get edit link
   */
  const getEditLink = (upload: Upload): string => {
    switch (upload.uploadType) {
      case 'note':
        const note = upload as Note;
        if (note.test) {
          return `/revision/${note.subject.id}/tests/${note.test.id}/resources/${note.id}/edit`;
        }
        return `/revision/${note.subject.id}/resources/${note.id}/edit`;
      case 'olympiad_resource':
        const resource = upload as OlympiadResource;
        return `/olympiads/${resource.olympiad.id}/resources/${resource.id}/edit`;
      case 'ucas_post':
        return `/ucas/posts/${upload.id}/edit`;
      case 'past_paper_record':
        return `/revision/practice/ppq/records/${upload.id}`;
      default:
        return '#';
    }
  };

  /**
   * Format upload date
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Render upload card
   */
  const renderUploadCard = (upload: Upload) => {
    const hasApprovalStatus = 'approved' in upload;
    
    return (
      <div
        key={`${upload.uploadType}-${upload.id}`}
        className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              {getUploadIcon(upload)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {getUploadTitle(upload)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getUploadTypeLabel(upload)}
              </p>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex items-center gap-2">
            {hasApprovalStatus && (
              <Badge variant={upload.approved ? "default" : "secondary"}>
                {upload.approved ? (
                  <>
                    <LuCheck className="h-3 w-3 mr-1" />
                    Approved
                  </>
                ) : (
                  <>
                    <LuClock className="h-3 w-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
            )}
            
            {hasApprovalStatus && upload.pinned && (
              <Badge variant="outline">Pinned</Badge>
            )}
          </div>
        </div>

        {/* Content preview */}
        <div className="mb-4">
          {'subject' in upload && (
            <p className="text-sm text-muted-foreground mb-2">
              {getYearGroupName(upload.subject.level)} {upload.subject.title}
              {'test' in upload && upload.test && (
                <span> → {upload.test.title}</span>
              )}
            </p>
          )}
          
          {'olympiad' in upload && (
            <p className="text-sm text-muted-foreground mb-2">
              {upload.olympiad.title} • {upload.olympiad.area}
            </p>
          )}
          
          {'tags' in upload && upload.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {upload.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {upload.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{upload.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {('desc' in upload && upload.desc) && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {upload.desc}
            </p>
          )}
          
          {('content' in upload && upload.content) && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {upload.content}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {upload.fileCount > 0 && (
              <span className="flex items-center gap-1">
                <LuFileText className="h-4 w-4" />
                {upload.fileCount} file{upload.fileCount !== 1 ? 's' : ''}
              </span>
            )}
            
            {'uploadedAt' in upload && (
              <span className="flex items-center gap-1">
                <LuCalendar className="h-4 w-4" />
                {formatDate(upload.uploadedAt)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link href={getUploadLink(upload)}>
              <Button variant="outline" size="sm">
                <LuEye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            
            <Link href={getEditLink(upload)}>
              <Button variant="outline" size="sm">
                <LuPencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <LuRefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchUploads} variant="outline">
            <LuRefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const tabUploads = getTabUploads(activeTab);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">My Uploads</h2>
        <p className="text-muted-foreground">
          Manage all your uploaded content in one place
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuActivity className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.totalUploads}</p>
              <p className="text-sm text-muted-foreground">Total Uploads</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuCheck className="h-8 w-8 text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.approvedUploads}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuClock className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.pendingUploads}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <LuFileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{summary.totalFiles}</p>
              <p className="text-sm text-muted-foreground">Files</p>
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
            placeholder="Search uploads..."
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
          <p className="mt-2 text-sm text-muted-foreground">
            Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
          </p>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({getAllUploads().length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            <LuFileText className="h-4 w-4 mr-1" />
            Notes ({uploads.notes.length})
          </TabsTrigger>
          <TabsTrigger value="olympiad">
            <LuTrophy className="h-4 w-4 mr-1" />
            Olympiad ({uploads.olympiadResources.length})
          </TabsTrigger>
          <TabsTrigger value="ucas">
            <LuGraduationCap className="h-4 w-4 mr-1" />
            UCAS ({uploads.ucasPosts.length})
          </TabsTrigger>
          <TabsTrigger value="records">
            <LuClipboard className="h-4 w-4 mr-1" />
            Records ({uploads.pastPaperRecords.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            <LuCheck className="h-4 w-4 mr-1" />
            Approved ({summary.approvedUploads})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <LuClock className="h-4 w-4 mr-1" />
            Pending ({summary.pendingUploads})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {tabUploads.length === 0 ? (
            <div className="text-center py-12">
              <LuFileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                {searchQuery ? `No uploads found for &quot;${searchQuery}&quot;` : 'No uploads found'}
              </p>
              {!searchQuery && (
                <Link href="/upload">
                  <Button>
                    <LuFileText className="h-4 w-4 mr-2" />
                    Upload Content
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tabUploads.map(renderUploadCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadManager;
