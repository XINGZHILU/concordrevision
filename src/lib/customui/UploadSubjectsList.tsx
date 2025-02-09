'use client';

import Link from "next/link";
import { SubjectTabs } from "./tabs";

export default function SubjectList({ subjects, year }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[], year: number
}) {
    const f3 = subjects.filter((subject) => subject.level === 0).map((subject) => (
        <li key={subject.title + 'li'}><Link key={subject.title + subject.id} className={'border-dotted border-2 border-blue-500'}
            href={`/upload/revision/${subject.id}`}>{subject.title}</Link></li>)
    );
    const f4 = subjects.filter((subject) => subject.level === 1).map((subject) => (
        <li key={subject.title + 'li'}><Link key={subject.title + subject.id} className={'border-dotted border-2 border-blue-500'}
            href={`/upload/revision/${subject.id}`}>{subject.title}</Link></li>)
    );
    const f5 = subjects.filter((subject) => subject.level === 2).map((subject) => (
        <li key={subject.title + 'li'}><Link key={subject.title + subject.id} className={'border-dotted border-2 border-blue-500'}
            href={`/upload/revision/${subject.id}`}>{subject.title}</Link></li>)
    );
    const f61 = subjects.filter((subject) => subject.level === 3).map((subject) => (
        <li key={subject.title + 'li'}><Link key={subject.title + subject.id} className={'border-dotted border-2 border-blue-500'}
            href={`/upload/revision/${subject.id}`}>{subject.title}</Link></li>)
    );
    const f62 = subjects.filter((subject) => subject.level === 4).map((subject) => (
        <li key={subject.title + 'li'}><Link key={subject.title + subject.id} className={'border-dotted border-2 border-blue-500'}
            href={`/upload/revision/${subject.id}`}>{subject.title}</Link></li>)
    );
    return (
        <SubjectTabs f3={f3} f4={f4} f5={f5} f61={f61} f62={f62} defaultval={['f3', 'f4', 'f5', '61', '62'][year]} />
    )
}