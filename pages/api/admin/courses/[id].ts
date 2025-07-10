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
        return res.status(403).json({ error: 'Forbidden - Teacher access required' });
    }

    if (req.method === 'GET') {
        try {
            const course = await prisma.ucasCourse.findUnique({
                where: { id: id as string },
            });
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            return res.status(200).json(course);
        } catch (error) {
            console.error('Failed to fetch course:', error);
            return res.status(500).json({ error: 'Failed to fetch course' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { ...courseData } = req.body;
            
            const updatedCourse = await prisma.ucasCourse.update({
                where: { id: id as string },
                data: {
                    ...courseData,
                    duration_years: Number(courseData.duration_years),
                    required_subjects: courseData.required_subjects.split(',').map((s: string) => s.trim()).filter(Boolean),
                    recommended_subjects: courseData.recommended_subjects.split(',').map((s: string) => s.trim()).filter(Boolean),
                },
            });
            return res.status(200).json(updatedCourse);
        } catch (error) {
            console.error('Failed to update course:', error);
            return res.status(500).json({ error: 'Failed to update course' });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 