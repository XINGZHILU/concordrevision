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

    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid course link ID' });
    }

    if (req.method === 'PUT') {
        const { courseId, name, description, entry_requirements, ucascode, duration, qualification, url } = req.body;
        
        if (!courseId || !name || !ucascode || !duration || !qualification) {
             return res.status(400).json({ message: 'Missing required fields for course link' });
        }

        try {
            const courseLink = await prisma.courseLink.update({
                where: { id: parseInt(id) },
                data: {
                    courseId,
                    name,
                    description,
                    entry_requirements,
                    ucascode,
                    duration,
                    qualification,
                    url,
                },
            });
            return res.status(200).json(courseLink);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update course link' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.courseLink.delete({
                where: { id: parseInt(id) },
            });
            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to delete course link' });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 