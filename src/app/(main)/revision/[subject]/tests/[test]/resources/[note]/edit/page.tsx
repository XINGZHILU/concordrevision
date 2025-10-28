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
    const { subject: sid, note: nid } = await params;

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

    // Check if current user is the author, admin, or teacher
    if (note.authorId !== user.id && !userRecord.admin && !userRecord.teacher) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                    <h1 className="text-xl font-bold text-destructive mb-2">Access Denied</h1>
                    <p className="text-destructive/80">You can only edit resources that you uploaded.</p>
                    <Link 
                        href={`/revision/${subject.id}/resources/${note.id}`}
                        className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
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
                            <Link href="/revision" className="text-muted-foreground hover:text-primary">
                                Revision
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-muted-foreground">/</span>
                                <Link href={`/revision/${subject.id}`} className="text-muted-foreground hover:text-primary">
                                    {subject.title}
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-muted-foreground">/</span>
                                <Link href={`/revision/${subject.id}/resources/${note.id}`} className="text-muted-foreground hover:text-primary">
                                    {note.title}
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <span className="mx-2 text-muted-foreground">/</span>
                                <span className="text-foreground">Edit</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    Edit Resource: {note.title}
                </h1>
                <p className="text-muted-foreground mb-6">
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