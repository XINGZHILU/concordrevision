import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);
    const { id } = req.query;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { teacher: true, admin : true },
    });

    if (!user || (!user.teacher && !user.admin)) {
        return res.status(403).json({ error: 'Forbidden - Teacher / admin access required' });
    }

    if (req.method === 'GET') {
        try {
            const university = await prisma.university.findUnique({
                where: { id: id as string },
            });
            if (!university) {
                return res.status(404).json({ error: 'University not found' });
            }
            return res.status(200).json(university);
        } catch (error) {
            console.error('Failed to fetch university:', error);
            return res.status(500).json({ error: 'Failed to fetch university' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { name, uk } = req.body;
            const updatedUniversity = await prisma.university.update({
                where: { id: id as string },
                data: { name, uk },
            });
            return res.status(200).json(updatedUniversity);
        } catch (error) {
            console.error('Failed to update university:', error);
            return res.status(500).json({ error: 'Failed to update university' });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 