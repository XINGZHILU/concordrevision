'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { LuInfo, LuTrendingUp, LuLink } from "react-icons/lu";
import { UniversityDetailsForm } from './university-details-form';
import { AdmissionStatsForm } from './admission-stats-form';
import { UniversityCoursesForm } from './university-course-links-form';
import { University, AdmissionStats, Course, UCASSubject } from '@prisma/client';

type UniversityWithRelations = University & {
  stats: AdmissionStats[];
  courses: (Course & {
    ucasSubject: UCASSubject;
  })[];
};

interface UniversityTeacherTabsProps {
  university: UniversityWithRelations;
  ucasSubjects: UCASSubject[];
}

/**
 * Client component for university teacher management with tabs for Details, Admission Stats, and Courses
 */
export function UniversityTeacherTabs({ university, ucasSubjects }: UniversityTeacherTabsProps) {
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
        <TabsTrigger value="courses" className="flex items-center gap-2">
          <LuLink className="h-4 w-4" />
          Courses
          {university.courses.length > 0 && (
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {university.courses.length}
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

      {/* Courses Tab */}
      <TabsContent value="courses" className="mt-0">
        <UniversityCoursesForm 
          universityId={university.id}
          courses={university.courses}
          ucasSubjects={ucasSubjects}
        />
      </TabsContent>
    </Tabs>
  );
}

