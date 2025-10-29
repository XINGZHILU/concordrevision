'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuGraduationCap, LuUniversity, LuLink } from "react-icons/lu";
import { UniversityManager } from "./UniversityManager";
import { CourseManager } from "./CourseManager";
import { CourseLinkManager } from "./CourseLinkManager";

interface University {
  id: string;
  name: string;
  description: string;
  uk: boolean;
  courseLinks: Array<{
    id: number;
    name: string;
    course: {
      id: string;
      name: string;
    };
  }>;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

interface CourseLink {
  id: number;
  name: string;
  description: string;
  entry_requirements: string;
  ucascode: string;
  duration: number;
  qualification: string;
  url: string | null;
  universityId: string;
  courseId: string;
  course: {
    id: string;
    name: string;
  };
  university: {
    id: string;
    name: string;
  };
}

interface UCASTeacherTabsProps {
  universities: University[];
  courses: Course[];
  courseLinks: CourseLink[];
}

/**
 * Client component for UCAS teacher management with tabs for Universities, Courses, and Course Links
 */
export function UCASTeacherTabs({ universities, courses, courseLinks }: UCASTeacherTabsProps) {
  const [activeTab, setActiveTab] = useState('universities');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="universities" className="flex items-center gap-2">
          <LuUniversity className="h-4 w-4" />
          Universities
          {universities.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {universities.length}
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
        <TabsTrigger value="courseLinks" className="flex items-center gap-2">
          <LuLink className="h-4 w-4" />
          Course Links
          {courseLinks.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {courseLinks.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Universities Tab */}
      <TabsContent value="universities" className="mt-0">
        <UniversityManager universities={universities} courses={courses} />
      </TabsContent>

      {/* Courses Tab */}
      <TabsContent value="courses" className="mt-0">
        <CourseManager courses={courses} />
      </TabsContent>

      {/* Course Links Tab */}
      <TabsContent value="courseLinks" className="mt-0">
        <CourseLinkManager 
          courseLinks={courseLinks} 
          courses={courses}
          universities={universities.map(u => ({ id: u.id, name: u.name }))}
        />
      </TabsContent>
    </Tabs>
  );
}

