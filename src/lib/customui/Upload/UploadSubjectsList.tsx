'use client';

import Link from "next/link";
import { SubjectTabs } from "@/lib/customui/Basic/tabs";
import { isYearGroupVisible, getVisibleYearGroups } from "@/lib/year-group-config";
import {
  LuBook, LuBeaker, LuCalculator, LuAtom, LuFlaskConical,
  LuLanguages, LuGlobe, LuPencilRuler, LuBookOpen, LuUpload,
  LuArrowRight, LuFileText, LuGraduationCap, LuStar
} from "react-icons/lu";

// Helper function to get appropriate icon based on subject name
function getSubjectIcon(subjectTitle: string) {
  const title = subjectTitle.toLowerCase();

  if (title.includes('math') || title.includes('maths')) return LuCalculator;
  if (title.includes('physics')) return LuAtom;
  if (title.includes('chemistry')) return LuFlaskConical;
  if (title.includes('biology')) return LuBeaker;
  if (title.includes('english') || title.includes('literature')) return LuBookOpen;
  if (title.includes('language') || title.includes('spanish') || title.includes('french')) return LuLanguages;
  if (title.includes('geography') || title.includes('earth')) return LuGlobe;
  if (title.includes('art') || title.includes('design')) return LuPencilRuler;
  if (title.includes('computer') || title.includes('ict')) return LuFileText;

  // Default icon
  return LuBook;
}

// Helper function to get subject color theme
function getSubjectColorTheme(subjectTitle: string) {
  const title = subjectTitle.toLowerCase();

  if (title.includes('math') || title.includes('maths'))
    return { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900' };
  if (title.includes('physics'))
    return { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-200 dark:border-purple-800', icon: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-900' };
  if (title.includes('chemistry'))
    return { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800', icon: 'text-green-600 dark:text-green-400', iconBg: 'bg-green-100 dark:bg-green-900' };
  if (title.includes('biology'))
    return { bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-200 dark:border-emerald-800', icon: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900' };
  if (title.includes('english') || title.includes('literature'))
    return { bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-200 dark:border-orange-800', icon: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-900' };
  if (title.includes('language'))
    return { bg: 'bg-pink-50 dark:bg-pink-950', border: 'border-pink-200 dark:border-pink-800', icon: 'text-pink-600 dark:text-pink-400', iconBg: 'bg-pink-100 dark:bg-pink-900' };
  if (title.includes('geography'))
    return { bg: 'bg-teal-50 dark:bg-teal-950', border: 'border-teal-200 dark:border-teal-800', icon: 'text-teal-600 dark:text-teal-400', iconBg: 'bg-teal-100 dark:bg-teal-900' };

  // Default theme
  return { bg: 'bg-gray-50 dark:bg-gray-950', border: 'border-gray-200 dark:border-gray-800', icon: 'text-gray-600 dark:text-gray-400', iconBg: 'bg-gray-100 dark:bg-gray-900' };
}

export default function SubjectList({ subjects, year }: {
  subjects: {
    id: number,
    title: string,
    desc: string,
    level: number
  }[],
  year: number
}) {
  // Filter subjects to only include those from visible year groups
  const visibleSubjects = subjects.filter(subject => isYearGroupVisible(subject.level));

  const createSubjectCard = (subject: { id: number; title: string; desc: string; }) => {
    const SubjectIcon = getSubjectIcon(subject.title);
    const colorTheme = getSubjectColorTheme(subject.title);

    return (
      <Link
        key={subject.id}
        href={`/upload/revision/${subject.id}`}
        className="group block"
      >
        <div className={`relative overflow-hidden rounded-2xl ${colorTheme.bg} ${colorTheme.border} border-2 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-gradient-to-br from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-14 h-14 ${colorTheme.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <SubjectIcon className={`w-7 h-7 ${colorTheme.icon}`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
              {subject.title}
            </h3>

            {/* Upload button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                <LuUpload className="w-4 h-4" />
                <span>Upload Content</span>
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md group-hover:shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <LuArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const f3 = visibleSubjects.filter((subject) => subject.level === 0).map(createSubjectCard);
  const f4 = visibleSubjects.filter((subject) => subject.level === 1).map(createSubjectCard);
  const f5 = visibleSubjects.filter((subject) => subject.level === 2).map(createSubjectCard);
  const f61 = visibleSubjects.filter((subject) => subject.level === 3).map(createSubjectCard);
  const f62 = visibleSubjects.filter((subject) => subject.level === 4).map(createSubjectCard);

  // Map year value to tab ID, but ensure the year group is visible
  const tabIds = ['f3', 'f4', 'f5', '61', '62'];
  const visibleYearGroups = getVisibleYearGroups();
  const requestedTabId = tabIds[year];
  const isRequestedVisible = visibleYearGroups.some(group => group.tabId === requestedTabId);
  const defaultTab = isRequestedVisible ? requestedTabId : (visibleYearGroups[0]?.tabId || 'f3');

  // Don't render anything if no year groups are visible
  if (visibleYearGroups.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LuGraduationCap className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Year Groups Available</h2>
          <p className="text-gray-600 dark:text-gray-300">No year groups are currently enabled for uploads. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <LuStar className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Subject</h2>
            <LuStar className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select a subject below to start uploading your study materials and help other students learn
        </p>
      </div>

      {/* Enhanced Subject Tabs */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <SubjectTabs
          f3={f3}
          f4={f4}
          f5={f5}
          f61={f61}
          f62={f62}
          defaultval={defaultTab}
        />
      </div>
    </div>
  );
}