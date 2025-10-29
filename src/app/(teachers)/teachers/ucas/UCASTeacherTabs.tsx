'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuGraduationCap, LuUniversity, LuLink } from "react-icons/lu";
import { UniversityManager } from "./UniversityManager";
import { UCASSubjectManager } from "./UCASSubjectManager";
import { CourseManager } from "./CourseManager";
import { University, UCASSubject, Course } from '@prisma/client';

type UniversityWithCourses = University & {
  courses: (Course & {
    ucasSubject: UCASSubject;
  })[];
};

type CourseWithRelations = Course & {
  ucasSubject: UCASSubject;
  university: University;
};

interface UCASTeacherTabsProps {
  universities: UniversityWithCourses[];
  ucasSubjects: UCASSubject[];
  courses: CourseWithRelations[];
}

/**
 * Client component for UCAS teacher management with tabs for Universities, UCAS Subjects, and Courses
 */
export function UCASTeacherTabs({ universities, ucasSubjects, courses }: UCASTeacherTabsProps) {
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
        <TabsTrigger value="ucasSubjects" className="flex items-center gap-2">
          <LuGraduationCap className="h-4 w-4" />
          UCAS Subjects
          {ucasSubjects.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {ucasSubjects.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="courses" className="flex items-center gap-2">
          <LuLink className="h-4 w-4" />
          Courses
          {courses.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {courses.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Universities Tab */}
      <TabsContent value="universities" className="mt-0">
        <UniversityManager universities={universities} ucasSubjects={ucasSubjects} />
      </TabsContent>

      {/* UCAS Subjects Tab */}
      <TabsContent value="ucasSubjects" className="mt-0">
        <UCASSubjectManager ucasSubjects={ucasSubjects} />
      </TabsContent>

      {/* Courses Tab */}
      <TabsContent value="courses" className="mt-0">
        <CourseManager 
          courses={courses} 
          ucasSubjects={ucasSubjects}
          universities={universities.map(u => ({ id: u.id, name: u.name }))}
        />
      </TabsContent>
    </Tabs>
  );
}

