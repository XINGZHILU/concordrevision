'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuGraduationCap, LuFileText, LuSearch, LuX, LuTrendingUp, LuPin } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import { Badge } from "@/lib/components/ui/badge";
import { Checkbox } from '@/lib/components/ui/checkbox';
import { Label } from '@/lib/components/ui/label';
import Link from 'next/link';
import { AdmissionStats } from '@prisma/client';
import MDViewer from '@/lib/customui/Basic/showMD';

interface Course {
  id: number;
  name: string;
  universityId: string;
  ucasSubjectId: string;
  ucasSubject: {
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

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  /**
   * Filter courses based on search query
   */
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;

    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter(course =>
      course.name.toLowerCase().includes(lowerQuery) ||
      course.ucasSubject.name.toLowerCase().includes(lowerQuery)
    );
  }, [courses, searchQuery]);

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
   * Clear search input
   */
  const clearSearch = () => {
    setSearchQuery('');
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
   * Render course cards with empty state handling
   */
  const renderCourseCards = () => {
    if (filteredCourses.length === 0) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
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
    );
  };

  /**
   * Render post cards with empty state handling
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
      <div className="space-y-4">
        {filteredPosts.map(post => (
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
              placeholder="Search courses..."
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

          {/* Courses Grid */}
          {renderCourseCards()}
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-0">
          {/* Search Bar and Tag Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
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
              <p className="text-sm text-muted-foreground">
                Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
              </p>
            )}
            
            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                      />
                      <Label htmlFor={`tag-${tag}`} className="cursor-pointer">{tag}</Label>
                    </label>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Posts List */}
          {renderPostCards()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchableUniversityContent;

