import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API handler for managing courses at a specific university by admins
 * Handles POST and DELETE requests for courses at a university
 */
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
        const { ucasSubjectId, name, description, entry_requirements, ucascode, duration, qualification, url } = req.body;
        
        if (!ucasSubjectId || !name || !ucascode || !duration || !qualification) {
             return res.status(400).json({ message: 'Missing required fields for course' });
        }

        try {
            const course = await prisma.course.create({
                data: {
                    universityId,
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
            return res.status(201).json(course);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create course' });
        }
    } else if (req.method === 'DELETE') {
        const { ucasSubjectId } = req.body;
        if (!ucasSubjectId) {
            return res.status(400).json({ message: 'UCAS subject ID is required' });
        }

        try {
            // Find the course first, then delete by ID
            const course = await prisma.course.findFirst({
                where: {
                    universityId,
                    ucasSubjectId,
                }
            });
            
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            
            await prisma.course.delete({
                where: {
                    id: course.id
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
