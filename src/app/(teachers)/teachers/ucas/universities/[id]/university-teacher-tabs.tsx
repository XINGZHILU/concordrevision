'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuTrendingUp, LuLink } from "react-icons/lu";
import { UniversityDetailsForm } from './university-details-form';
import { AdmissionStatsForm } from './admission-stats-form';
import { UniversityCourseLinksForm } from './university-course-links-form';
import { University, AdmissionStats, CourseLink, Course } from '@prisma/client';

type UniversityWithRelations = University & {
  stats: AdmissionStats[];
  courseLinks: (CourseLink & {
    course: Course;
  })[];
};

interface UniversityTeacherTabsProps {
  university: UniversityWithRelations;
  courses: Course[];
}

/**
 * Client component for university teacher management with tabs for Details, Admission Stats, and Course Links
 */
export function UniversityTeacherTabs({ university, courses }: UniversityTeacherTabsProps) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="details" className="flex items-center gap-2">
          <LuInfo className="h-4 w-4" />
          Details
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <LuTrendingUp className="h-4 w-4" />
          Admission Stats
          {university.stats.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {university.stats.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="courseLinks" className="flex items-center gap-2">
          <LuLink className="h-4 w-4" />
          Course Links
          {university.courseLinks.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {university.courseLinks.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Details Tab */}
      <TabsContent value="details" className="mt-0">
        <UniversityDetailsForm university={university} />
      </TabsContent>

      {/* Admission Stats Tab */}
      <TabsContent value="stats" className="mt-0">
        <AdmissionStatsForm universityId={university.id} stats={university.stats} />
      </TabsContent>

      {/* Course Links Tab */}
      <TabsContent value="courseLinks" className="mt-0">
        <UniversityCourseLinksForm 
          universityId={university.id}
          courseLinks={university.courseLinks}
          courses={courses}
        />
      </TabsContent>
    </Tabs>
  );
}

