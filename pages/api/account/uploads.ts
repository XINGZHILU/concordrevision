import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API endpoint to fetch all uploads for the current user
 * Returns notes, olympiad resources, UCAS posts, and past paper records
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Fetch all user uploads in parallel
        const [notes, olympiadResources, ucasPosts, pastPaperRecords] = await Promise.all([
            // Notes (revision resources)
            prisma.note.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    subject: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                        },
                    },
                    test: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    files: {
                        select: {
                            id: true,
                            filename: true,
                            type: true,
                        },
                    },
                },
                orderBy: {
                    uploadedAt: 'desc',
                },
            }),

            // Olympiad resources
            prisma.olympiad_Resource.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    olympiad: {
                        select: {
                            id: true,
                            title: true,
                            area: true,
                        },
                    },
                    files: {
                        select: {
                            id: true,
                            filename: true,
                            type: true,
                        },
                    },
                },
                orderBy: {
                    uploadedAt: 'desc',
                },
            }),

            // UCAS posts
            prisma.uCASPost.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    files: {
                        select: {
                            id: true,
                            filename: true,
                            type: true,
                        },
                    },
                },
                orderBy: {
                    uploadedAt: 'desc',
                },
            }),

            // Past paper records
            prisma.pastPaperRecord.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    subject: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            }),
        ]);

        // Format the response with upload type information
        const uploads = {
            notes: notes.map(note => ({
                ...note,
                uploadType: 'note' as const,
                fileCount: note.files.length,
            })),
            olympiadResources: olympiadResources.map(resource => ({
                ...resource,
                uploadType: 'olympiad_resource' as const,
                fileCount: resource.files.length,
            })),
            ucasPosts: ucasPosts.map(post => ({
                ...post,
                uploadType: 'ucas_post' as const,
                fileCount: post.files.length,
            })),
            pastPaperRecords: pastPaperRecords.map(record => ({
                ...record,
                uploadType: 'past_paper_record' as const,
                fileCount: 0, // Past paper records don't have files
            })),
        };

        // Calculate summary statistics
        const summary = {
            totalUploads: notes.length + olympiadResources.length + ucasPosts.length + pastPaperRecords.length,
            approvedUploads: notes.filter(n => n.approved).length + 
                           olympiadResources.filter(r => r.approved).length + 
                           ucasPosts.filter(p => p.approved).length,
            pendingUploads: notes.filter(n => !n.approved).length + 
                          olympiadResources.filter(r => !r.approved).length + 
                          ucasPosts.filter(p => !p.approved).length,
            totalFiles: notes.reduce((sum, n) => sum + n.files.length, 0) +
                       olympiadResources.reduce((sum, r) => sum + r.files.length, 0) +
                       ucasPosts.reduce((sum, p) => sum + p.files.length, 0),
        };

        return res.status(200).json({
            uploads,
            summary,
        });
    } catch (error) {
        console.error('Error fetching user uploads:', error);
        return res.status(500).json({ message: 'Error fetching uploads' });
    }
}
