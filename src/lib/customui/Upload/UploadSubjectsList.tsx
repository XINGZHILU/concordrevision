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
    // Generate lists of subjects by level for each tab
    const f3 = subjects.filter((subject) => subject.level === 0).map((subject) => (
        <li key={subject.title + 'li'}>
            <Link
                key={subject.title + subject.id}
                href={`/upload/revision/${subject.id}`}
                className="inline-block py-2 px-3 text-indigo-600 hover:text-indigo-800 hover:underline"
            >
                {subject.title}
            </Link>
        </li>
    ));

    const f4 = subjects.filter((subject) => subject.level === 1).map((subject) => (
        <li key={subject.title + 'li'}>
            <Link
                key={subject.title + subject.id}
                href={`/upload/revision/${subject.id}`}
                className="inline-block py-2 px-3 text-indigo-600 hover:text-indigo-800 hover:underline"
            >
                {subject.title}
            </Link>
        </li>
    ));

    const f5 = subjects.filter((subject) => subject.level === 2).map((subject) => (
        <li key={subject.title + 'li'}>
            <Link
                key={subject.title + subject.id}
                href={`/upload/revision/${subject.id}`}
                className="inline-block py-2 px-3 text-indigo-600 hover:text-indigo-800 hover:underline"
            >
                {subject.title}
            </Link>
        </li>
    ));

    const f61 = subjects.filter((subject) => subject.level === 3).map((subject) => (
        <li key={subject.title + 'li'}>
            <Link
                key={subject.title + subject.id}
                href={`/upload/revision/${subject.id}`}
                className="inline-block py-2 px-3 text-indigo-600 hover:text-indigo-800 hover:underline"
            >
                {subject.title}
            </Link>
        </li>
    ));

    const f62 = subjects.filter((subject) => subject.level === 4).map((subject) => (
        <li key={subject.title + 'li'}>
            <Link
                key={subject.title + subject.id}
                href={`/upload/revision/${subject.id}`}
                className="inline-block py-2 px-3 text-indigo-600 hover:text-indigo-800 hover:underline"
            >
                {subject.title}
            </Link>
        </li>
    ));

    // Map year value to tab ID
    const tabIds = ['f3', 'f4', 'f5', '61', '62'];

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Subjects by Year Group</h2>

            <SubjectTabs
                f3={f3}
                f4={f4}
                f5={f5}
                f61={f61}
                f62={f62}
                defaultval={tabIds[year]}
            />
        </div>
    );
}