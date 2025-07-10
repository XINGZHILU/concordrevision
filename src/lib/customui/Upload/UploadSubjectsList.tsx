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
    const createSubjectCard = (subject: { id: number; title: string; desc: string; }) => (
        <Link
            key={subject.id}
            href={`/upload/revision/${subject.id}`}
            className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card text-card-foreground"
        >
            <h3 className="text-lg font-semibold">{subject.title}</h3>
        </Link>
    );

    const f3 = subjects.filter((subject) => subject.level === 0).map(createSubjectCard);
    const f4 = subjects.filter((subject) => subject.level === 1).map(createSubjectCard);
    const f5 = subjects.filter((subject) => subject.level === 2).map(createSubjectCard);
    const f61 = subjects.filter((subject) => subject.level === 3).map(createSubjectCard);
    const f62 = subjects.filter((subject) => subject.level === 4).map(createSubjectCard);

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