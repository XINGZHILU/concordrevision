import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || !dbUser.admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id: universityId } = req.query;

    if (typeof universityId !== 'string') {
        return res.status(400).json({ message: 'Invalid university ID' });
    }

    if (req.method === 'POST') {
        const { courseIds } = req.body;
        if (!Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({ message: 'Course IDs are required' });
        }

        try {
            await prisma.courseLink.createMany({
                data: courseIds.map((courseId: string) => ({
                    universityId,
                    courseId,
                })),
            });
            return res.status(200).json({ message: 'Courses added successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to add courses' });
        }
    } else if (req.method === 'DELETE') {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }

        try {
            await prisma.courseLink.delete({
                where: {
                    universityId_courseId: {
                        universityId,
                        courseId,
                    }
                },
            });
            return res.status(200).json({ message: 'Course removed successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to remove course' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 