'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuGraduationCap, LuFileText, LuSearch, LuX, LuTrendingUp, LuPin } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import { Badge } from "@/lib/components/ui/badge";
import { Checkbox } from '@/lib/components/ui/checkbox';
import { Label } from '@/lib/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import Link from 'next/link';
import { AdmissionStats, UCASSubjectType } from '@prisma/client';
import MDViewer from '@/lib/customui/Basic/showMD';

interface Course {
  id: number;
  name: string;
  universityId: string;
  ucasSubjectId: string;
  ucasSubject: {
    id: string;
    name: string;
    type: UCASSubjectType;
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

interface University {
  id: string;
  name: string;
  description: string;
}

interface SearchableUniversityContentProps {
  university: University;
  courses: Course[];
  stats: AdmissionStats[];
  posts: UCASPost[];
  isTeacher?: boolean;
}

/**
 * Client component that displays university details with tabs for About, Admission Stats, Courses and Posts
 * Courses are specific degree offerings at this university (e.g., "BSc Computer Science")
 * Provides search functionality for courses and posts
 * If isTeacher is true, course links go to editing page
 */
const SearchableUniversityContent = ({
  university,
  courses,
  stats,
  posts,
}: SearchableUniversityContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<UCASSubjectType | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
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
   * Get all available categories from courses
   */
  const availableCategories = useMemo(() => {
    const categorySet = new Set<UCASSubjectType>();
    courses.forEach(course => {
      categorySet.add(course.ucasSubject.type);
    });
    return Array.from(categorySet).sort();
  }, [courses]);

  /**
   * Get subjects for the selected category, sorted alphabetically
   */
  const subjectsInCategory = useMemo(() => {
    const subjectMap = new Map<string, { id: string; name: string; type: UCASSubjectType }>();
    courses.forEach(course => {
      if (selectedCategory === 'all' || course.ucasSubject.type === selectedCategory) {
        if (!subjectMap.has(course.ucasSubject.id)) {
          subjectMap.set(course.ucasSubject.id, {
            id: course.ucasSubject.id,
            name: course.ucasSubject.name,
            type: course.ucasSubject.type,
          });
        }
      }
    });
    return Array.from(subjectMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [courses, selectedCategory]);

  /**
   * Filter courses based on category, selected subject, and search query
   */
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course =>
        course.ucasSubject.type === selectedCategory
      );
    }

    // Apply subject filter (within the selected category)
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(course =>
        course.ucasSubject.id === selectedSubject
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(lowerQuery) ||
        course.ucasSubject.name.toLowerCase().includes(lowerQuery) ||
        course.qualification.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedSubject]);

  /**
   * Paginate filtered courses
   */
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, currentPage, coursesPerPage]);

  /**
   * Calculate total pages
   */
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
   * Handle category change - reset selected subject and page when category changes
   */
  const handleCategoryChange = (category: UCASSubjectType | 'all') => {
    setSelectedCategory(category);
    setSelectedSubject('all'); // Clear subject selection when changing category
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Handle subject change - reset page when subject changes
   */
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Handle search change - reset both pages when search changes
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset courses page
    setPostsCurrentPage(1); // Reset posts page
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
    setPostsCurrentPage(1); // Reset to first page
  };

  /**
   * Clear all tag selections
   */
  const clearTags = () => {
    setSelectedTags([]);
    setPostsCurrentPage(1);
  };

  /**
   * Format category name for display (replace underscores with spaces and proper capitalization)
   */
  const formatCategoryName = (category: UCASSubjectType): string => {
    return category.replace(/_/g, ' & ');
  };

  /**
   * Render admission statistics table
   */
  const renderAdmissionStats = () => {
    if (stats.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No admission statistics available</p>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuTrendingUp className="h-5 w-5" />
            Admission Statistics for Concord Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="text-right">Offers</TableHead>
                <TableHead className="text-right">Offer Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.sort((a, b) => b.year - a.year).map((stat) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.year}</TableCell>
                  <TableCell className="text-right">{stat.applied}</TableCell>
                  <TableCell className="text-right">{stat.accepted}</TableCell>
                  <TableCell className="text-right">
                    {stat.applied > 0 ? `${((stat.accepted / stat.applied) * 100).toFixed(1)}%` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  /**
   * Render course cards with empty state handling and pagination
   */
  const renderCourseCards = () => {
    if (filteredCourses.length === 0) {
      return searchQuery || selectedCategory !== 'all' || selectedSubject !== 'all' ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No courses found matching your filters</p>
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
          Showing {((currentPage - 1) * coursesPerPage) + 1} - {Math.min(currentPage * coursesPerPage, filteredCourses.length)} of {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCourses.map(course => (
            <Link
              href={`/ucas/schools/${university.id}/${course.id}`}
              key={course.id}
            >
              <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{course.name} ({course.qualification})</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Subject: {course.ucasSubject.name}
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
        <h1 className="mb-2">{university.name}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <LuInfo className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <LuTrendingUp className="h-4 w-4" />
            Admission Stats
            {stats.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {stats.length}
              </span>
            )}
          </TabsTrigger>
        <TabsTrigger value="courses" className="flex items-center gap-2">
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
            <MDViewer content={university.description || 'No description available.'} />
          </div>
        </TabsContent>

        {/* Admission Stats Tab */}
        <TabsContent value="stats" className="mt-0">
          {renderAdmissionStats()}
        </TabsContent>

      {/* Courses Tab */}
      <TabsContent value="courses" className="mt-0">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Search & Filter Courses</h3>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search courses by name, subject, or qualification..."
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

            {/* Category and Subject Filters */}
            {(availableCategories.length > 1 || subjectsInCategory.length > 1) && (
              <div className="flex flex-col md:flex-row gap-4">
                {/* Category Filter */}
                {availableCategories.length > 1 && (
                  <div className="flex-1">
                    <Label className="text-sm font-medium mb-2 block">Category</Label>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {availableCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {formatCategoryName(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Subject Filter - Only show if there are subjects in selected category */}
                {subjectsInCategory.length > 1 && (
                  <div className="flex-1">
                    <Label className="text-sm font-medium mb-2 block">Subject</Label>
                    <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjectsInCategory.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Courses Grid with Pagination */}
        {renderCourseCards()}
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

export default SearchableUniversityContent;

