/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

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

export default async function Page({ params }: { params: { subject: string, note: string } }) {
    function Get_Colour(usr: { red: number[]; amber: number[]; green: number[] }, nid: number) {
        if (usr.red.includes(nid)) {
            return 2;
        }
        else if (usr.amber.includes(nid)) {
            return 1;
        }
        else if (usr.green.includes(nid)) {
            return 0;
        }
        else {
            return -1;
        }
    }

    const sid = params.subject;
    const nid = params.note;

    if (!isNumeric(sid) || !isNumeric(nid)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        },
    });


    if (!subject) {
        notFound();
    }

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

    if (!note) {
        notFound();
    }

    if (!note.approved) {
        notFound();
    }

    const user = await currentUser();
    const colour = user ? await getUserColor(user.id, note.id) : -1;

    const authorName = note.author.firstname && note.author.lastname
        ? `${note.author.firstname} ${note.author.lastname}`
        : "Anonymous";

    // Check if current user is the author
    const canEdit = user && note.author.id === user.id;

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href={`/revision/${subject.id}`}
                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                    <LuArrowLeft className="mr-2" />
                    <span>Back to {subject.title}</span>
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
                            <span className="font-medium">{year_group_names[subject.level]} {subject.title}</span>
                            <span>•</span>
                            <span>Contributed by {authorName}</span>
                        </div>
                    </div>
                    
                    {/* Edit button - only show for authors */}
                    {canEdit && (
                        <div className="flex-shrink-0">
                            <Link
                                href={`/upload/revision/${subject.id}/resources/${note.id}/edit`}
                                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                <LuPencil className="h-4 w-4 mr-2" />
                                Edit Resource
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {user && (
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">My Knowledge Level</h2>
                    <ColourSelector nid={note.id} uid={user.id} subject={subject.id} Original={colour} />
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

    async function getUserColor(userId: string, noteId: number) {
        const record = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!record) {
            return -1;
        }

        return Get_Colour(record, noteId);
    }
}