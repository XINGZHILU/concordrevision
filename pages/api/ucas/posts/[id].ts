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
        if (userId !== post.authorId && !dbUser?.admin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { title, content, tags, universities, courses } = req.body;

        try {
            const updatedPost = await prisma.uCASPost.update({
                where: { id: postId },
                data: {
                    title,
                    content,
                    tags,
                    universities,
                    courses,
                },
            });
            return res.status(200).json(updatedPost);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update post' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 