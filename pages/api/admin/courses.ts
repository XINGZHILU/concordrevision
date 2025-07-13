import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { CourseType } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || !dbUser.admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'POST') {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' });
        }

        if (!Object.values(CourseType).includes(type)) {
            return res.status(400).json({ message: 'Invalid course type' });
        }

        try {
            const newCourse = await prisma.course.create({
                data: {
                    id: name.toLowerCase().replace(/ /g, '-'),
                    name,
                    type,
                },
            });
            return res.status(201).json(newCourse);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create course' });
        }
    } else if (req.method === 'PUT') {
        const { id, name, type } = req.body;
        if (!id || !name || !type) {
            return res.status(400).json({ message: 'ID, name, and type are required' });
        }
        try {
            const updatedCourse = await prisma.course.update({
                where: { id },
                data: { name, type },
            });
            return res.status(200).json(updatedCourse);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update course' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        try {
            await prisma.course.delete({ where: { id } });
            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to delete course' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
