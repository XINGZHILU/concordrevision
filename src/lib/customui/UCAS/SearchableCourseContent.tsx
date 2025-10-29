'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuGraduationCap, LuFileText, LuSearch, LuX } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import Link from 'next/link';

interface CourseLink {
  id: number;
  name: string;
  universityId: string;
  university: {
    id: string;
    name: string;
  };
}

interface UCASPost {
  id: number;
  title: string;
  author: {
    firstname: string | null;
    lastname: string | null;
  };
}

interface Course {
  id: string;
  name: string;
  description: string;
}

interface SearchableCourseContentProps {
  course: Course;
  courseLinks: CourseLink[];
  posts: UCASPost[];
}

/**
 * Client component that displays course details with tabs for About, Universities and Posts
 * Provides search functionality for universities and posts
 */
const SearchableCourseContent = ({
  course,
  courseLinks,
  posts
}: SearchableCourseContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  /**
   * Filter universities based on search query
   */
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return courseLinks;

    const lowerQuery = searchQuery.toLowerCase();
    return courseLinks.filter(courseLink =>
      courseLink.university.name.toLowerCase().includes(lowerQuery) ||
      courseLink.name.toLowerCase().includes(lowerQuery)
    );
  }, [courseLinks, searchQuery]);

  /**
   * Filter posts based on search query
   */
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;

    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery)
    );
  }, [posts, searchQuery]);

  /**
   * Clear search input
   */
  const clearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Render university cards with empty state handling
   */
  const renderUniversityCards = () => {
    if (filteredUniversities.length === 0) {
      return searchQuery ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No universities found for &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No universities offering this course</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUniversities.map(courseLink => (
          <Link
            href={`/ucas/schools/${courseLink.universityId}/${courseLink.id}`}
            key={courseLink.id}
          >
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-lg">{courseLink.university.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {courseLink.name}
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
      return searchQuery ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts found for &quot;{searchQuery}&quot;</p>
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
            <Card className="hover:border-primary transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  By {post.author.firstname} {post.author.lastname}
                </p>
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
        <h1 className="mb-2">{course.name}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="about" className="flex items-center gap-2">
            <LuInfo className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="universities" className="flex items-center gap-2">
            <LuGraduationCap className="h-4 w-4" />
            Universities
            {courseLinks.length > 0 && (
              <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {courseLinks.length}
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
            <p>{course.description}</p>
          </div>
        </TabsContent>

        {/* Universities Tab */}
        <TabsContent value="universities" className="mt-0">
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
                placeholder="Search universities..."
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

          {/* Universities Grid */}
          {renderUniversityCards()}
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-0">
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
              <p className="mt-2 text-sm text-muted-foreground">
                Searching for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
              </p>
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

