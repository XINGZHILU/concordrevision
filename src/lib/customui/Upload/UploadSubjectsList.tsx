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
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-min-600">
                {filteredSubjects.map(subject => (
                    <li key={`${subject.title}-${subject.id}`}>
                        <Link
                            href={`/upload/revision/${subject.id}`}
                            className="block h-full bg-white hover:bg-indigo-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-6 group"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-medium mr-4">
                                    {subject.title.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                                        {subject.title}
                                    </h3>
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
        <div className="rounded-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Subjects by Year Group</h2>
                <p className="text-gray-600 mt-1">
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