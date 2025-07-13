import Link from "next/link";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { LuCalendar, LuPencil, LuUpload } from "react-icons/lu";
import { TestBadge } from "./Badges";
import { cva } from 'class-variance-authority';

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

const cardVariants = cva(
  "relative group w-full bg-card border-border border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
  {
    variants: {
      color: {
        unclassified: "bg-card border-border border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
        green: "bg-green-50 border-green-200 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
        amber: "bg-amber-50 border-amber-200 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
        red: "bg-red-50 border-red-200 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
      },
    },
    defaultVariants: {
      color: "unclassified",
    },
  }
);


export function OlympiadResourceCard({ resource, user, canEdit }: {
  resource: {
    id: number,
    title: string,
    desc: string,
    olympiadId: number,
    author: {
      id: string;
      email: string;
      firstname: string | null;
      lastname: string | null;
      teacher: boolean;
      admin: boolean;
      upload_permission: boolean;
      year: number;
    }
  }
  canEdit: boolean
}) {
  return (
    <div className={cardVariants({ color: 'unclassified' })}>
      <Link href={`/olympiads/${resource.olympiadId}/resources/${resource.id}`} className="block p-8">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-card-foreground">{resource.title}</h3>
      </Link>
      <div className="border-t border-border px-8 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <LuUpload />
          <span className="truncate max-w-32">{resource.author.firstname} {resource.author.lastname}</span>
          {canEdit && (
            <Link href={`/olympiads/${resource.olympiadId}/resources/${resource.id}/edit`} className="text-primary hover:underline flex items-center">
              <LuPencil className="h-3 w-3 mr-1" />
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}