import Link from "next/link";
import React from "react";
import {Badge} from "@chakra-ui/react";
import {LuCalendar} from "react-icons/lu";

export function NoteCard({note, colour}: {
    note: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
    },
    colour: number
}) {
    // https://flowbite.com/docs/components/card/
    return (
        <Link href={`/revision/${note.subjectId}/resources/${note.id}`}>
            <div
                className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h5>
                <BadgeSymbol colour={colour}/>
            </div>
        </Link>
    );
}

export function TestNoteCard({note, colour}: {
    note: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
        testId: number
    },
    colour: number
}) {
    // https://flowbite.com/docs/components/card/
    return (
        <Link href={`/revision/${note.subjectId}/tests/${note.testId}/${note.id}`}>
            <div
                className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h5>
                <BadgeSymbol colour={colour}/>
            </div>
        </Link>
    );
}



export function BadgeSymbol({colour}: { colour: number }) {
    if (colour === 0) {
        return (
            <Badge colorPalette="green">Green</Badge>
        );
    } else if (colour === 1) {
        return (
            <Badge colorPalette="yellow">Amber</Badge>
        );
    } else if (colour === 2) {
        return (
            <Badge colorPalette="red">Red</Badge>
        );
    } else {
        return (
            <Badge>Unclassified</Badge>
        );
    }
}

export function TestCard({test}: {
    test: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
        type: number,
        date: Date
    }
}) {
    if (test.type === 0) {
        return (
            <Link href={`/revision/${test.subjectId}/tests/${test.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{test.title}</h5>
                    <Badge colorPalette='green'>Saturday Test</Badge><br/>
                    <Badge><LuCalendar/>{test.date.toDateString()}</Badge>
                </div>

            </Link>
        );
    } else if (test.type === 1) {
        return (
            <Link href={`/revision/${test.subjectId}/tests/${test.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{test.title}</h5>
                    <Badge colorPalette='yellow'>End of term exam</Badge><br/>
                    <Badge><LuCalendar/>{test.date.toDateString()}</Badge>
                </div>

            </Link>
        );
    } else {
        return (
            <Link href={`/revision/${test.subjectId}/tests/${test.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{test.title}</h5>
                    <Badge colorPalette='red'>Public exam</Badge><br/>
                    <Badge><LuCalendar/>{test.date.toDateString()}</Badge>
                </div>
            </Link>
        );
    }
}

export function TestLinkCard({test}: {
    test: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
        type: number,
        date: Date
    }
}) {
    if (test.type === 0) {
        return (
            <Link href={`/upload/revision/${test.subjectId}/test-revision/${test.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{test.title}</h5>
                    <Badge colorPalette='green'>Saturday Test</Badge><br/>
                    <Badge><LuCalendar/>{test.date.toDateString()}</Badge>
                </div>

            </Link>
        );
    } else if (test.type === 1) {
        return (
            <Link href={`/upload/revision/${test.subjectId}/test-revision/${test.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{test.title}</h5>
                    <Badge colorPalette='yellow'>End of term exam</Badge><br/>
                    <Badge><LuCalendar/>{test.date.toDateString()}</Badge>
                </div>

            </Link>
        );
    } else {
        return (
            <Link href={`/upload/revision/${test.subjectId}/test-revision/${test.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{test.title}</h5>
                    <Badge colorPalette='red'>Public exam</Badge><br/>
                    <Badge><LuCalendar/>{test.date.toDateString()}</Badge>
                </div>
            </Link>
        );
    }
}

export function OlympiadResourceCard({resource}: {
    resource: {
        id: number,
        title: string,
        desc: string,
        olympiadId: number
    }
}) {
    return (
        <>
            <Link href={`/olympiads/${resource.olympiadId}/resources/${resource.id}`}>
                <div
                    className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{resource.title}</h5>
                </div>
            </Link>
        </>
    );
}