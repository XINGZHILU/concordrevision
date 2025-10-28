import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API handler for creating course links by teachers
 * Handles POST requests to add new course links to a university
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
        const { courseId, name, description, entry_requirements, ucascode, duration, qualification, url, universityId } = req.body;

        if (!courseId || !name || !ucascode || !duration || !qualification || !universityId) {
            return res.status(400).json({ message: 'Missing required fields for course link' });
        }

        try {
            const courseLink = await prisma.courseLink.create({
                data: {
                    courseId,
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
            return res.status(201).json(courseLink);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create course link' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

