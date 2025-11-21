'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuGraduationCap, LuFileText, LuSearch, LuX, LuPin } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Badge } from "@/lib/components/ui/badge";
import { Checkbox } from '@/lib/components/ui/checkbox';
import { Label } from '@/lib/components/ui/label';
import Link from 'next/link';
import MDViewer from '@/lib/customui/Basic/showMD';

interface Course {
  id: number;
  name: string;
  universityId: string;
  university: {
    id: string;
    name: string;
  };
  qualification: string;
}

interface UCASPost {
  id: number;
  title: string;
  tags: string[];
  pinned: boolean;
  author: {
    firstname: string | null;
    lastname: string | null;
  };
}

interface UCASSubject {
  id: string;
  name: string;
  description: string;
}

interface SearchableUCASSubjectContentProps {
  ucasSubject: UCASSubject;
  courses: Course[];
  posts: UCASPost[];
  isTeacher?: boolean;
}

/**
 * Client component that displays UCAS subject details with tabs for About, Courses and Posts
 * Courses are specific offerings of this subject at different universities
 * Provides search functionality for courses and posts
 * If isTeacher is true, course links go to editing page
 */
const SearchableUCASSubjectContent = ({
  ucasSubject,
  courses,
  posts,
}: SearchableUCASSubjectContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsCurrentPage, setPostsCurrentPage] = useState(1);
  const coursesPerPage = 12;
  const postsPerPage = 10;

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  /**
   * Filter universities based on search query
   */
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return courses;

    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter(course =>
      course.university.name.toLowerCase().includes(lowerQuery) ||
      course.name.toLowerCase().includes(lowerQuery)
    );
  }, [courses, searchQuery]);

  /**
   * Paginate filtered courses
   */
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return filteredUniversities.slice(startIndex, endIndex);
  }, [filteredUniversities, currentPage, coursesPerPage]);

  /**
   * Calculate total pages for courses
   */
  const totalPages = Math.ceil(filteredUniversities.length / coursesPerPage);

  /**
   * Filter posts based on search query and selected tags
   */
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchMatch = !searchQuery.trim() || post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag));
      return searchMatch && tagMatch;
    });
  }, [posts, searchQuery, selectedTags]);

  /**
   * Paginate filtered posts
   */
  const paginatedPosts = useMemo(() => {
    const startIndex = (postsCurrentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, postsCurrentPage, postsPerPage]);

  /**
   * Calculate total pages for posts
   */
  const postsTotalPages = Math.ceil(filteredPosts.length / postsPerPage);

  /**
   * Clear search input and reset both pages
   */
  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setPostsCurrentPage(1);
  };

  /**
   * Handle search change - reset both pages when search changes
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setPostsCurrentPage(1);
  };

  /**
   * Handle tag selection - reset posts page when tags change
   */
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPostsCurrentPage(1);
  };

  /**
   * Clear all tag selections
   */
  const clearTags = () => {
    setSelectedTags([]);
    setPostsCurrentPage(1);
  };

  /**
   * Render university cards with empty state handling and pagination
   */
  const renderUniversityCards = () => {
    if (filteredUniversities.length === 0) {
      return searchQuery ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No courses found for &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No courses available</p>
        </div>
      );
    }

    return (
      <>
        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {((currentPage - 1) * coursesPerPage) + 1} - {Math.min(currentPage * coursesPerPage, filteredUniversities.length)} of {filteredUniversities.length} course{filteredUniversities.length !== 1 ? 's' : ''}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCourses.map(course => (
            <Link
              href={`/ucas/schools/${course.universityId}/${course.id}`}
              key={course.id}
            >
              <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{course.name} ({course.qualification})</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {course.university.name}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        page === currentPage
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 py-2">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  /**
   * Render post cards with empty state handling and pagination
   */
  const renderPostCards = () => {
    if (filteredPosts.length === 0) {
      return searchQuery || selectedTags.length > 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found matching your filters</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts available</p>
        </div>
      );
    }

    return (
      <>
        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {((postsCurrentPage - 1) * postsPerPage) + 1} - {Math.min(postsCurrentPage * postsPerPage, filteredPosts.length)} of {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {paginatedPosts.map(post => (
            <Link href={`/ucas/posts/${post.id}`} key={post.id} className="block">
              <Card className="hover:border-primary transition-colors duration-200 relative">
                {post.pinned && (
                  <div className="absolute top-4 right-4">
                    <LuPin className="h-5 w-5 text-primary" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg pr-8">{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {post.author.firstname} {post.author.lastname}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {postsTotalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPostsCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={postsCurrentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: postsTotalPages }, (_, i) => i + 1).map(page => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === postsTotalPages ||
                  (page >= postsCurrentPage - 1 && page <= postsCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setPostsCurrentPage(page)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        page === postsCurrentPage
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === postsCurrentPage - 2 || page === postsCurrentPage + 2) {
                  return <span key={page} className="px-2 py-2">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setPostsCurrentPage(prev => Math.min(postsTotalPages, prev + 1))}
              disabled={postsCurrentPage === postsTotalPages}
              className="px-4 py-2 border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2">{ucasSubject.name}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <LuInfo className="h-4 w-4" />
            About
          </TabsTrigger>
        <TabsTrigger value="universities" className="flex items-center gap-2">
          <LuGraduationCap className="h-4 w-4" />
          Courses
          {courses.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {courses.length}
            </span>
          )}
        </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <LuFileText className="h-4 w-4" />
            Posts
            {posts.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {posts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="mt-0">
          <div className="prose dark:prose-invert max-w-none">
            <MDViewer content={ucasSubject.description || 'No description available.'} />
          </div>
        </TabsContent>

      {/* Courses Tab */}
      <TabsContent value="universities" className="mt-0">
        {/* Search */}
        <div className="mb-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Search Courses</h3>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search courses by university or program name..."
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
          </div>
        </div>

        {/* Courses Grid with Pagination */}
        {renderUniversityCards()}
      </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-0">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Search & Filter Posts</h3>
              
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuSearch className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search posts by title..."
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

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Filter by Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="cursor-pointer">{tag}</Label>
                      </label>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                      </p>
                      <button
                        onClick={clearTags}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear tag filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Posts List with Pagination */}
          {renderPostCards()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchableUCASSubjectContent;

