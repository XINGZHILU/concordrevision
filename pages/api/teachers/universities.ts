import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API handler for university management by teachers
 * Handles POST requests to create new universities
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
        const { name, uk } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        try {
            const newUniversity = await prisma.university.create({
                data: {
                    id: name.toLowerCase().replace(/ /g, '-'),
                    name,
                    uk,
                },
            });
            return res.status(201).json(newUniversity);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create university' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

