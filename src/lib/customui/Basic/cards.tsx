import Link from "next/link";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { LuCalendar } from "react-icons/lu";
import { TestBadge } from "./Badges";

export function NoteCard({ note, colour }: {
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
                className={`max-w-sm p-6 bg-card border-border border-2 rounded-lg shadow-sm`}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{note.title}</h5>
                <BadgeSymbol colour={colour} />
            </div>
        </Link>
    );
}

export function TestNoteCard({ note, colour }: {
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
                className={`max-w-sm p-6 bg-card border-border border-2 rounded-lg shadow-sm`}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{note.title}</h5>
                <BadgeSymbol colour={colour} />
            </div>
        </Link>
    );
}



export function BadgeSymbol({ colour }: { colour: number }) {
    if (colour === 0) {
        return (
            <Badge variant="default">Green</Badge>
        );
    } else if (colour === 1) {
        return (
            <Badge variant="secondary">Amber</Badge>
        );
    } else if (colour === 2) {
        return (
            <Badge variant="destructive">Red</Badge>
        );
    } else {
        return (
            <Badge variant="outline">Unclassified</Badge>
        );
    }
}

export function TestCard({ test }: {
    test: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
        type: number,
        date: Date
    }
}) {
    return (
        <Link href={`/revision/${test.subjectId}/tests/${test.id}`}>
            <div
                className={`max-w-sm p-6 bg-card border-border border-2 rounded-lg shadow-sm`}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{test.title}</h5>
                <TestBadge type={test.type} /><br />
                <Badge><LuCalendar />{test.date.toDateString()}</Badge>
            </div>
        </Link>
    );
}

export function TestLinkCard({ test }: {
    test: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
        type: number,
        date: Date
    }
}) {
    return <Link href={`/upload/revision/${test.subjectId}/test-revision/${test.id}`}>
        <div
            className={`max-w-sm p-6 bg-card border-border border-2 rounded-lg shadow-sm`}>
            <h5 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{test.title}</h5>
            <TestBadge type={test.type} /><br />
            <Badge><LuCalendar />{test.date.toDateString()}</Badge>
        </div>
    </Link>;
}

export function OlympiadResourceCard({ resource }: {
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
                    className={`max-w-sm p-6 bg-card border-border border-2 rounded-lg shadow-sm`}>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{resource.title}</h5>
                </div>
            </Link>
        </>
    );
}