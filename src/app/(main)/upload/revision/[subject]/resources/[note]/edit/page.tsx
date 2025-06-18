import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { year_group_names } from "@/lib/consts";
import { currentUser } from '@clerk/nextjs/server';
import Link from "next/link";
import EditResourceForm from "@/lib/customui/Upload/EditResourceForm";

interface PageProps {
    params: {
        subject: string;
        note: string;
    };
}

/**
 * Edit page for revision resources
 * Only allows authors to edit their own resources
 */
export default async function EditResourcePage({ params }: PageProps) {
    const { subject: sid, note: nid } = params;

    // Check if parameters are valid numbers
    if (!isNumeric(sid) || !isNumeric(nid)) {
        notFound();
    }

    // Get current user
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    // Get user record from database
    const userRecord = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!userRecord) {
        return <h1>User not found</h1>;
    }

    // Get subject information
    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        }
    });

    if (!subject) {
        notFound();
    }

    // Get note with author information
    const note = await prisma.note.findUnique({
        where: {
            id: +nid,
            subjectId: +sid
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

    // Check if current user is the author
    if (note.authorId !== user.id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h1 className="text-xl font-bold text-red-800 mb-2">Access Denied</h1>
                    <p className="text-red-700">You can only edit resources that you uploaded.</p>
                    <Link 
                        href={`/revision/${subject.id}/resources/${note.id}`}
                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Resource
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/revision" className="text-gray-700 hover:text-blue-600">
                                Revision
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <Link href={`/revision/${subject.id}`} className="text-gray-700 hover:text-blue-600">
                                    {subject.title}
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <Link href={`/revision/${subject.id}/resources/${note.id}`} className="text-gray-700 hover:text-blue-600">
                                    {note.title}
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">Edit</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Edit Resource: {note.title}
                </h1>
                <p className="text-gray-600 mb-6">
                    {year_group_names[subject.level]} {subject.title}
                </p>

                <EditResourceForm
                    noteId={note.id}
                    subjectId={subject.id}
                    initialData={{
                        title: note.title,
                        description: note.desc,
                        files: note.files
                    }}
                />
            </div>
        </div>
    );
} 