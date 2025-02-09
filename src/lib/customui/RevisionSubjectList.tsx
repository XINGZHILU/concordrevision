'use client';


import { SubjectItem } from './SubjectItem'
import { Link as CL, Tabs } from "@chakra-ui/react"

const RevisionSubjectList = ({ subjects, year }: {
    subjects: {
        id: number,
        title: string,
        desc: string,
        level: number
    }[], year: number
}) => {
    const years = ['f3', 'f4', 'f5', '61', '62'];
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
        <div className="w-screen">
            <Tabs.Root defaultValue={years[year]} variant='plain' rounded="l3">
                <Tabs.List p="1">
                    <Tabs.Trigger value="f3" asChild p="2">
                        <CL unstyled href="#f3">
                            Form 3
                        </CL>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="f4" asChild p="2">
                        <CL unstyled href="#f4">
                            Form 4
                        </CL>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="f5" asChild p="2">
                        <CL unstyled href="#f5">
                            Form 5
                        </CL>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="61" asChild p="2">
                        <CL unstyled href="#61">
                            6.1
                        </CL>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="62" asChild p="2">
                        <CL unstyled href="#62">
                            6.2
                        </CL>
                    </Tabs.Trigger>
                    <Tabs.Indicator rounded="l2" />
                </Tabs.List>
                <Tabs.Content value="f3">
                    <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24 w-screen'>{f3}</div>
                </Tabs.Content>
                <Tabs.Content value="f4">
                    <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24 w-screen'>{f4}</div>
                </Tabs.Content><Tabs.Content value="f5">
                    <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24 w-screen'>{f5}</div>
                </Tabs.Content><Tabs.Content value="61">
                    <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24 w-screen'>{f61}</div>
                </Tabs.Content><Tabs.Content value="62">
                    <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24 w-screen'>{f62}</div>
                </Tabs.Content>
            </Tabs.Root>

        </div>
    )
}

export default RevisionSubjectList