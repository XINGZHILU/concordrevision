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
import { LuArrowLeft, LuFileText, LuCalendar } from "react-icons/lu";

export default async function Page({ params }: { params: { subject: string, note: string, test: string } }) {
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
    const testId = params.test;

    if (!isNumeric(sid) || !isNumeric(nid) || !isNumeric(testId)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        }
    });

    if (!subject) {
        notFound();
    }

    const test = await prisma.test.findUnique({
        where: {
            id: +testId
        }
    });

    if (!test) {
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
                    firstname: true,
                    lastname: true
                }
            }
        }
    });

    if (!note || !note.approved) {
        notFound();
    }

    const user = await currentUser();
    const colour = user ? await getUserColor(user.id, note.id) : -1;

    const testType = getTestTypeLabel(test.type);
    const authorName = note.author.firstname && note.author.lastname
        ? `${note.author.firstname} ${note.author.lastname}`
        : "Anonymous";

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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {note.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{year_group_names[subject.level]} {subject.title}</span>
                    <span>•</span>
                    <span className="flex items-center">
                        <LuCalendar className="mr-1" />
                        Test date: {new Date(test.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {testType}
                    </span>
                    <span>•</span>
                    <span>Contributed by {authorName}</span>
                </div>
            </div>

            {user && (
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">My Knowledge Level</h2>
                    <ColourSelector nid={note.id} uid={user.id} subject={subject.id} Original={colour} />
                </div>
            )}

            {/* Two-column layout */}
            {/* Conditional layout based on whether there are files */}
            {note.files.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main content - larger proportion */}
                    <div className="flex-grow md:w-3/4">
                        <div className="rounded-lg shadow-md border border-border p-8 mb-6">
                            <div className="flex items-center justify-between mb-5 border-b pb-3 border-border">
                                <h2 className="text-2xl font-semibold text-primary">Test Preparation Materials</h2>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    {getTestTypeLabel(test.type)}
                                </span>
                            </div>
                            <div className="prose prose-lg max-w-none text-foreground">
                                <MDViewer content={note.desc} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar for files - only shown when there are files */}
                    <div className="md:w-1/4">
                        <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-20">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <LuFileText className="mr-2" />
                                Attachments
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({note.files.length})
                                </span>
                            </h2>
                            <FileList files={note.files} />
                        </div>
                    </div>
                </div>
            ) : (
                /* Full width content when no files */
                <div className="w-full">
                    <div className="rounded-lg shadow-md border border-border p-8 mb-6">
                        <div className="flex items-center justify-between mb-5 border-b pb-3 border-border">
                            <h2 className="text-2xl font-semibold text-primary">Test Preparation Materials</h2>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {getTestTypeLabel(test.type)}
                            </span>
                        </div>
                        <div className="prose prose-lg max-w-none text-foreground">
                            <MDViewer content={note.desc} />
                        </div>
                    </div>
                </div>
            )}
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

function getTestTypeLabel(type: number): string {
    switch (type) {
        case 0: return "Saturday Test";
        case 1: return "End of Term Exam";
        case 2: return "Public Exam";
        default: return "Test";
    }
}