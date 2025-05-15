// File: app/admin/users/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@chakra-ui/react";
import UserActions from "./user-actions";

export default async function UserDetailPage({ params }: { params: { id: string } }) {

    const userId = params.id;

    if (!userId) {
        notFound();
    }

    // Fetch user with contributions
    const userDetails = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            notes: {
                include: {
                    subject: true,
                },
                orderBy: { id: 'desc' },
            },
            _count: {
                select: {
                    notes: true,
                    posts: true,
                    olympiad_resources: true,
                },
            },
        },
    });

    if (!userDetails) {
        notFound();
    }

    // Categorize notes by year group
    const notesByYearGroup = userDetails.notes.reduce((acc, note) => {
        const yearGroup = note.subject.level;
        if (!acc[yearGroup]) {
            acc[yearGroup] = [];
        }
        acc[yearGroup].push(note);
        return acc;
    }, {} as Record<number, typeof userDetails.notes>);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Details</h1>
                <Link
                    href="/admin/users"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                    Back to Users
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{`${userDetails.firstname} ${userDetails.lastname}` || 'Anonymous User'}</h2>
                            <p className="text-gray-600">{userDetails.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-2">
                            <Badge colorPalette={userDetails.teacher ? 'indigo' : 'gray'}>
                                {userDetails.teacher ? 'Teacher' : 'Student'}
                            </Badge>
                            <Badge colorPalette={userDetails.upload_permission ? 'green' : 'red'}>
                                {userDetails.upload_permission ? 'Upload Permission' : 'No Upload Permission'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="text-2xl font-bold text-blue-700">{userDetails._count.notes}</div>
                            <div className="text-sm text-blue-600">Notes</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-2xl font-bold text-purple-700">{userDetails._count.posts}</div>
                            <div className="text-sm text-purple-600">Posts</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-2xl font-bold text-green-700">{userDetails._count.olympiad_resources}</div>
                            <div className="text-sm text-green-600">Olympiad Resources</div>
                        </div>
                    </div>

                    <UserActions
                        userId={userDetails.id}
                        uploadPermission={userDetails.upload_permission}
                        isTeacher={userDetails.teacher}
                    />
                </div>
            </div>

            {/* User's contributions */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Recent Contributions</h3>

                    {userDetails.notes.length === 0 ? (
                        <p className="text-gray-500">This user hasn&#39;t made any contributions yet.</p>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="text-gray-600">Showing {userDetails.notes.length} most recent notes</p>
                            </div>

                            {Object.entries(notesByYearGroup).map(([yearGroupIndex, notes]) => (
                                <div key={yearGroupIndex} className="mb-6">
                                    <h4 className="text-md font-semibold mb-2 text-gray-700">
                                        Year Group: {yearGroupIndex} ({notes.length} notes)
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {notes.map(note => (
                                                    <tr key={note.id} className="hover:bg-gray-100">
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{note.title}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{note.subject.title}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            <Badge colorPalette={note.approved ? 'green' : 'yellow'}>
                                                                {note.approved ? 'Approved' : 'Pending'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                                                            {note.approved ? (
                                                                <Link href={`/revision/${note.subject.id}/resources/${note.id}`}>
                                                                    View
                                                                </Link>
                                                            ) : (
                                                                <Link href={`/admin/approval/${note.id}`}>
                                                                    Review
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}