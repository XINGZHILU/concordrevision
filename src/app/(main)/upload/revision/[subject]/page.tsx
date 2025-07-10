import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { isNumeric } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: { subject: string } }) {
    const user = await currentUser();

    if (!user) {
        return (
            <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
                <div className="bg-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Required</h1>
                    <p className="text-muted-foreground mb-6">You must be logged in to access this page.</p>
                    <Link href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!record) {
        return (
            <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
                <div className="bg-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-4">User Not Found</h1>
                    <p className="text-muted-foreground mb-6">We could not find your user record in our system.</p>
                    <Link href="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!record.upload_permission) {
        return (
            <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
                <div className="bg-card p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">You do not have permission to access this page.</p>
                    <Link href="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const sid = params.subject;

    if (!isNumeric(sid)) {
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

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Upload Materials
                        </h1>
                        <p className="text-muted-foreground">
                            Subject: <span className="font-medium text-foreground">{subject.title}</span>
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Resource Materials</h2>
                            <p className="text-muted-foreground mb-4">Upload study guides, notes, and other learning resources for students.</p>
                        </div>
                        <div className="px-6 py-4 bg-muted">
                            <Link
                                href={`/upload/revision/${subject.id}/resources`}
                                className="w-full inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Upload Resources
                            </Link>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Test Revision Materials</h2>
                            <p className="text-muted-foreground mb-4">Upload practice tests, sample questions, and test preparation guides.</p>
                        </div>
                        <div className="px-6 py-4 bg-muted">
                            <Link
                                href={`/upload/revision/${subject.id}/test-revision`}
                                className="w-full inline-block text-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Upload Test Materials
                            </Link>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Schedule a Test</h2>
                            <p className="text-muted-foreground mb-4">Create and schedule new tests with deadlines and notifications.</p>
                        </div>
                        <div className="px-6 py-4 bg-muted">
                            <Link
                                href={`/upload/revision/${subject.id}/create_test`}
                                className="w-full inline-block text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Create New Test
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}