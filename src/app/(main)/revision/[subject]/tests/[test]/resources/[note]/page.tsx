


import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { year_group_names } from "@/lib/consts";
import { currentUser } from "@clerk/nextjs/server";
import ColourSelector from "@/lib/customui/Revision/ColourSelector";
import FileList from "@/lib/customui/Basic/filelist";
import MDViewer from "@/lib/customui/Basic/showMD";
import Link from "next/link";
import { LuArrowLeft, LuFileText, LuFile, LuPencil } from "react-icons/lu";
import { PinButton } from "./PinButton";

export default async function Page({ params }: { params: { subject: string, test: string, note: string } }) {
  const page_params = await params;
  const sid = page_params.subject;
  const nid = page_params.note;
  const tid = page_params.test;


  if (!isNumeric(sid) || !isNumeric(nid) || !isNumeric(tid)) {
    notFound();
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: +sid
    },
  });

  const note = await prisma.note.findUnique({
    where: {
      id: +nid
    },
    include: {
      files: true,
      author: {
        select: {
          id: true,
          firstname: true,
          lastname: true
        }
      }
    }
  });

  const test = await prisma.test.findUnique({
    where: {
      id: +tid
    },
  });

  console.log(subject, note, test);

  if (!note || !test || !subject) {
    notFound();
  }

  if (!note.approved || note.testId != test.id || note.subjectId != subject.id) {
    notFound();
  }

  const user = await currentUser();
  const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;
  const colourLink = user ? await prisma.colourLink.findFirst({
    where: {
      userId: user.id,
      noteId: note.id,
    }
  }) : null;
  const colour = colourLink?.colour || "Unclassified";

  const authorName = note.author.firstname && note.author.lastname
    ? `${note.author.firstname} ${note.author.lastname}`
    : "Anonymous";

  // Check if current user is the author or admin
  const canEdit = user && (note.author.id === user.id || (dbUser && dbUser.admin));
  const isAdmin = dbUser?.admin ?? false;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/revision/${subject.id}/tests/${test.id}`}
          className="flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <LuArrowLeft className="mr-2" />
          <span>Back to {test.title}</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{test.title}</span>
              <span>•</span>
              <span className="font-medium">{year_group_names[subject.level]} {subject.title}</span>
              <span>•</span>
              <span>Contributed by {authorName}</span>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {canEdit && (
              <Link
                href={`/revision/${subject.id}/test/${test.id}/resources/${note.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <LuPencil className="h-4 w-4 mr-2" />
                Edit Resource
              </Link>
            )}
            {isAdmin && (
              <PinButton noteId={note.id} initialPinned={note.pinned} />
            )}
          </div>
        </div>
      </div>

      {user && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">My Knowledge Level</h2>
          <ColourSelector noteId={note.id} subjectId={subject.id} initialColour={colour} />
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content - larger proportion */}
        <div className="flex-grow md:w-3/4">
          <div className="bg-card rounded-lg shadow-md border border-border p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-5 text-primary border-b pb-3 border-border">Content</h2>
            <div className="prose prose-lg max-w-none text-foreground">
              <MDViewer content={note.desc} />
            </div>
          </div>
        </div>

        {/* Sidebar for files - narrower */}
        <div className="md:w-1/4">
          <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <LuFileText className="mr-2" />
              Attachments
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({note.files.length})
              </span>
            </h2>

            {note.files.length > 0 ? (
              <FileList files={note.files} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <LuFile className="mx-auto h-10 w-10 mb-2" />
                <p>No files attached</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}