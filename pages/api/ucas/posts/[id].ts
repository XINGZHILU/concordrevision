import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'PUT') {
        const { id } = req.query;
        const postId = parseInt(id as string, 10);

        const post = await prisma.uCASPost.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        // Allow authors, admins, and teachers to edit posts
        if (userId !== post.authorId && !dbUser?.admin && !dbUser?.teacher) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { title, content, tags, universities, courses, newFiles, deletedFiles } = req.body;

        try {
            await prisma.$transaction(async (tx) => {
                if (deletedFiles && deletedFiles.length > 0) {
                    // Just disassociate files, don't delete from storage
                    await tx.storageFile.updateMany({
                        where: {
                            id: { in: deletedFiles },
                            ucasPostId: postId
                        },
                        data: {
                            ucasPostId: null
                        }
                    });
                }

                await tx.uCASPost.update({
                    where: { id: postId },
                    data: {
                        title,
                        content,
                        tags,
                        universities,
                        courses,
                    },
                });

                if (newFiles && newFiles.length > 0) {
                    await tx.storageFile.createMany({
                        data: newFiles.map((file: { name: string, url: string, type: string }) => ({
                            filename: file.name,
                            path: file.url,
                            type: file.type.split('/')[1] || 'file',
                            ucasPostId: postId,
                        })),
                    });
                }
            });
            return res.status(200).json({ message: "Post updated successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update post' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 