import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { UCASSubjectType } from '@prisma/client';

/**
 * API handler for UCAS subject management by admins
 * Handles POST, PUT, and DELETE requests for UCAS subjects (formerly courses)
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

    if (req.method === 'POST') {
        const { name, type } = req.body;
        if (!name || !type || !Object.values(UCASSubjectType).includes(type)) {
            return res.status(400).json({ message: 'Name and a valid type are required' });
        }
        try {
            const ucasSubject = await prisma.uCASSubject.create({
                data: { id: name.toLowerCase().replace(/ /g, '-'), name, type, description: '' },
            });
            return res.status(201).json(ucasSubject);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to create UCAS subject' });
        }
    } else if (req.method === 'PUT') {
        const { id, name, type, description } = req.body;
        if (!id || !name || !type || !Object.values(UCASSubjectType).includes(type)) {
            return res.status(400).json({ message: 'ID, name, and a valid type are required' });
        }
        try {
            const ucasSubject = await prisma.uCASSubject.update({
                where: { id },
                data: { name, type, description },
            });
            return res.status(200).json(ucasSubject);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to update UCAS subject' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'UCAS subject ID is required' });
        }
        try {
            await prisma.uCASSubject.delete({ where: { id } });
            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to delete UCAS subject' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

