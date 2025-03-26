'use client';

import Link from "next/link";
import { SubjectTabs } from "../Basic/tabs";

export default function SubjectList({ subjects, year }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[],
    year: number
}) {
    // Level to year group mapping
    const levelLabels = {
        0: 'Form 3',
        1: 'Form 4',
        2: 'Form 5',
        3: 'Form 6 (Year 1)',
        4: 'Form 6 (Year 2)'
    };

    // Tab IDs to match the expected format
    const tabIds = ['f3', 'f4', 'f5', '61', '62'];

    // Function to generate subject items for a specific level
    const generateSubjectItems = (level: number) => {
        const filteredSubjects = subjects.filter(subject => subject.level === level);

        if (filteredSubjects.length === 0) {
            return (
                <div className="py-8 text-center text-gray-500">
                    <p>No subjects available for this level.</p>
                </div>
            );
        }

        return (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map(subject => (
                    <li key={`${subject.title}-${subject.id}`}>
                        <Link
                            href={`/upload/revision/${subject.id}`}
                            className="block h-full bg-white hover:bg-indigo-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 group"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 mr-3">
                                    {subject.title.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                                        {subject.title}
                                    </h3>
                                    {subject.desc && (
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {subject.desc}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        );
    };

    // Generate content for each tab
    const f3 = generateSubjectItems(0);
    const f4 = generateSubjectItems(1);
    const f5 = generateSubjectItems(2);
    const f61 = generateSubjectItems(3);
    const f62 = generateSubjectItems(4);

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Subjects by Year Group</h2>
                <p className="text-gray-600 text-sm">
                    Select a year group and subject to upload resources
                </p>
            </div>

            <SubjectTabs
                f3={[f3]}
                f4={[f4]}
                f5={[f5]}
                f61={[f61]}
                f62={[f62]}
                defaultval={tabIds[year]}
            />
        </div>
    );
}