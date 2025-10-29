'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuGraduationCap, LuFileText, LuSearch, LuX, LuTrendingUp } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import Link from 'next/link';
import { AdmissionStats } from '@prisma/client';

interface CourseLink {
  id: number;
  name: string;
  universityId: string;
  courseId: string;
  course: {
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

interface University {
  id: string;
  name: string;
  description: string;
}

interface SearchableUniversityContentProps {
  university: University;
  courseLinks: CourseLink[];
  stats: AdmissionStats[];
  posts: UCASPost[];
}

/**
 * Client component that displays university details with tabs for About, Admission Stats, Courses and Posts
 * Provides search functionality for courses and posts
 */
const SearchableUniversityContent = ({
  university,
  courseLinks,
  stats,
  posts
}: SearchableUniversityContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  /**
   * Filter courses based on search query
   */
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courseLinks;

    const lowerQuery = searchQuery.toLowerCase();
    return courseLinks.filter(courseLink =>
      courseLink.name.toLowerCase().includes(lowerQuery) ||
      courseLink.course.name.toLowerCase().includes(lowerQuery)
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
        {filteredCourses.map(courseLink => (
          <Link
            href={`/ucas/schools/${university.id}/${courseLink.id}`}
            key={courseLink.id}
          >
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-lg">{courseLink.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {courseLink.course.name}
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
            <p>{university.description}</p>
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

export default SearchableUniversityContent;

