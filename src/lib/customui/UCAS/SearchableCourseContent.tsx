'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuFileText, LuSearch, LuX, LuPin } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Badge } from "@/lib/components/ui/badge";
import { Checkbox } from '@/lib/components/ui/checkbox';
import { Label } from '@/lib/components/ui/label';
import Link from 'next/link';
import MDViewer from '@/lib/customui/Basic/showMD';

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

interface Course {
  id: number;
  name: string;
  description: string;
  entry_requirements: string;
  ucascode: string;
  duration: number;
  qualification: string;
  url: string | null;
  universityId: string;
  ucasSubjectId: string;
  university: {
    id: string;
    name: string;
  };
  ucasSubject: {
    id: string;
    name: string;
  };
}

interface SearchableCourseContentProps {
  course: Course;
  posts: UCASPost[];
}

/**
 * Client component that displays course (university-specific degree offering) details with tabs for About and Posts
 * Provides search functionality for posts
 */
const SearchableCourseContent = ({
  course,
  posts
}: SearchableCourseContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
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
        <h1 className="mb-2">{course.name} ({course.qualification})</h1>
        <h2 className="text-2xl text-muted-foreground">
          <Link href={`/ucas/schools/${course.university.id}`} className="hover:underline hover:text-primary transition-colors">
            {course.university.name}
          </Link>
          {' - '}
          <Link href={`/ucas/subjects/${course.ucasSubject.id}`} className="hover:underline hover:text-primary transition-colors">
            {course.ucasSubject.name}
          </Link>
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <LuFileText className="h-4 w-4" />
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <LuInfo className="h-4 w-4" />
            Details
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

        {/* Details Tab */}
        <TabsContent value="basic" className="mt-0">
          <Card>
            <CardContent className="space-y-4">
              <br />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">UCAS Code</h3>
                  <p className="text-muted-foreground">{course.ucascode}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Qualification</h3>
                  <p className="text-muted-foreground">{course.qualification}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">{course.duration} years</p>
                </div>
                {course.url && (
                  <div>
                    <h3 className="font-semibold mb-2">Course Website</h3>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Entry Requirements</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {course.entry_requirements || 'No entry requirements specified.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Description Tab */}
        <TabsContent value="details" className="mt-0">
          <Card>
            <br />
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <MDViewer content={course.description || 'No description available.'} />
              </div>
            </CardContent>
          </Card>
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

export default SearchableCourseContent;

