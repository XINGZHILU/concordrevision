import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API handler for creating courses at a university by teachers
 * Handles POST requests to add new courses to a university
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify user is a teacher or admin
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || (!dbUser.admin && !dbUser.teacher)) {
        return res.status(403).json({ message: 'Forbidden - Teacher access required' });
    }

    if (req.method === 'POST') {
        const { ucasSubjectId, name, description, entry_requirements, ucascode, duration, qualification, url, universityId } = req.body;

        if (!ucasSubjectId || !name || !ucascode || !duration || !qualification || !universityId) {
            return res.status(400).json({ message: 'Missing required fields for course' });
        }

        try {
            const course = await prisma.course.create({
                data: {
                    ucasSubjectId,
                    name,
                    description,
                    entry_requirements,
                    ucascode,
                    duration,
                    qualification,
                    url,
                    universityId,
                },
            });
            return res.status(201).json(course);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create course' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
