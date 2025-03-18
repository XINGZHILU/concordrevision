'use client';

import { SubjectItem } from '../Upload/SubjectItem'
import { SubjectTabs } from '../Basic/tabs';

const RevisionSubjectList = ({ subjects, year }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[], year: number
}) => {
    
    const f3 = subjects.filter((subject) => subject.level === 0).map((subject) => (
        <SubjectItem key={subject.title + subject.id} subject={subject} />)
    );
    const f4 = subjects.filter((subject) => subject.level === 1).map((subject) => (
        <SubjectItem key={subject.title + subject.id} subject={subject} />)
    );
    const f5 = subjects.filter((subject) => subject.level === 2).map((subject) => (
        <SubjectItem key={subject.title + subject.id} subject={subject} />)
    );
    const f61 = subjects.filter((subject) => subject.level === 3).map((subject) => (
        <SubjectItem key={subject.title + subject.id} subject={subject} />)
    );
    const f62 = subjects.filter((subject) => subject.level === 4).map((subject) => (
        <SubjectItem key={subject.title + subject.id} subject={subject} />)
    );

    return (
        <SubjectTabs f3={f3} f4={f4} f5={f5} f61={f61} f62={f62} defaultval={['f3', 'f4', 'f5', '61', '62'][year]}/>
    )
}

export default RevisionSubjectList