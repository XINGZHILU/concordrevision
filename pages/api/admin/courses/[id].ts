import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API handler for course management by admins
 * Handles PUT and DELETE requests for specific courses (formerly course links)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || !dbUser.admin || !dbUser.teacher) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (req.method === 'PUT') {
        const { ucasSubjectId, name, description, entry_requirements, ucascode, duration, qualification, url } = req.body;
        
        if (!ucasSubjectId || !name || !ucascode || !duration || !qualification) {
             return res.status(400).json({ message: 'Missing required fields for course' });
        }

        try {
            const course = await prisma.course.update({
                where: { id: parseInt(id) },
                data: {
                    ucasSubjectId,
                    name,
                    description,
                    entry_requirements,
                    ucascode,
                    duration,
                    qualification,
                    url,
                },
            });
            return res.status(200).json(course);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update course' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.course.delete({
                where: { id: parseInt(id) },
            });
            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to delete course' });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

