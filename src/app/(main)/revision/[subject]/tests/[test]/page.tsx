/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { getYearGroupName, isYearGroupVisible } from "@/lib/year-group-config";
import { currentUser } from "@clerk/nextjs/server";
import { TestNoteCard } from "@/lib/customui/Basic/cards";
import MDViewer from "@/lib/customui/Basic/showMD";
import { TestBadge } from "@/lib/customui/Basic/Badges";


export default async function Page(req: any, res: any) {
  function Get_Colour(colours: { red: number[]; amber: number[]; green: number[] }, nid: number) {
    if (colours.red.includes(nid)) {
      return 2;
    } else if (colours.amber.includes(nid)) {
      return 1;
    } else if (colours.green.includes(nid)) {
      return 0;
    } else {
      return -1;
    }
  }


  const params = await req.params;
  const sid = params.subject;
  const tid = params.test;

  if (!isNumeric(sid) || !isNumeric(tid)) {
    notFound();
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: +sid
    },
    include: {
      notes: true,
      tests: true
    }
  });

  if (!subject) {
    notFound();
  }

  // Check if the year group is visible
  if (!isYearGroupVisible(subject.level)) {
    notFound();
  }

  const test = await prisma.test.findUnique({
    where: {
      id: +tid
    },
    include: {
      notes: true
    }
  });

  if (!test) {
    notFound();
  }

  const notes = test.notes.filter((note) => note.approved && note.testId !== null);

  const user = await currentUser();
  if (!user) {
    return (<div className="w-full">
      <h1>{getYearGroupName(subject.level)} {subject.title} - {test.title}</h1>
      <br />
      <ul>
        <li><b>Test
          Type:</b> <TestBadge type={test.type} />
        </li>
        <li><b>Test Date:</b> {test.date.toDateString()}</li>
      </ul>
      <br />
      <h2>Information</h2>
      <div className="flex-grow md:w-3/4">
        <div className="bg-card rounded-lg shadow-md border border-border p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-5 text-primary border-b pb-3 border-border">Content</h2>
          <div className="prose prose-lg max-w-none text-foreground">
            <MDViewer content={test.desc} />
          </div>
        </div>
      </div>
      <br />
      <h2>Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-h-screen overflow-y-scroll">
        {
          notes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            notes.map((note) => (
              <div key={note.id}>
                <TestNoteCard note={note as any} colour={-1} />
              </div>
            ))
          )
        }
      </div>
    </div>)
  }

  const colourLinks = await prisma.colourLink.findMany({
    where: {
      userId: user.id,
      subjectId: +sid,
    }
  });

  const userColours = {
    red: colourLinks.filter(link => link.colour === 'Red').map(link => link.noteId),
    amber: colourLinks.filter(link => link.colour === 'Amber').map(link => link.noteId),
    green: colourLinks.filter(link => link.colour === 'Green').map(link => link.noteId),
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">{test.title}</h1>
        <p className="text-2xl text-muted-foreground mt-1">{getYearGroupName(subject.level)} {subject.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Test Details</h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-center gap-4">
                <strong className="font-semibold text-foreground w-24">Test Type:</strong>
                <TestBadge type={test.type} />
              </li>
              <li className="flex items-center gap-4">
                <strong className="font-semibold text-foreground w-24">Test Date:</strong>
                <span>{test.date.toDateString()}</span>
              </li>
            </ul>
          </div>
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 lg:p-8">
            <h2 className="text-2xl font-semibold mb-5 text-primary">Information</h2>
            <div className="prose dark:prose-invert max-w-none text-foreground">
              <MDViewer content={test.desc} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Revision Notes</h2>
        {notes.length === 0 ? (
          <div className="flex items-center justify-center h-40 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No notes found for this test.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <TestNoteCard key={note.id} note={note as any} colour={Get_Colour(userColours, note.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}