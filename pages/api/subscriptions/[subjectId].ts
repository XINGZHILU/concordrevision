import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const subjectId = parseInt(req.query.subjectId as string, 10);

    if (isNaN(subjectId)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const where = {
        userId,
        subjectId,
    };

    if (req.method === 'GET') {
        const subscription = await prisma.userSubjectSubscription.findFirst({ where });
        return res.status(200).json(subscription);
    } 
    
    if (req.method === 'POST') {
        const existingSubscription = await prisma.userSubjectSubscription.findFirst({ where });

        if (existingSubscription) {
             return res.status(200).json(existingSubscription);
        } else {
            const newSubscription = await prisma.userSubjectSubscription.create({
                data: {
                    userId,
                    subjectId,
                    test_notification: true,
                    resource_notification: false,
                }
            });
            return res.status(201).json(newSubscription);
        }
    } 
    
    if (req.method === 'PATCH') {
        const { test_notification, resource_notification } = req.body;
        if (typeof test_notification !== 'boolean' || typeof resource_notification !== 'boolean') {
            return res.status(400).json({ message: 'Invalid notification settings' });
        }
        const updateResult = await prisma.userSubjectSubscription.updateMany({
            where: where,
            data: {
                test_notification,
                resource_notification,
            },
        });

        if (updateResult.count > 0) {
            const subscription = await prisma.userSubjectSubscription.findFirst({ where });
            return res.status(200).json(subscription);
        } else {
             return res.status(404).json({ message: 'Subscription not found to update.' });
        }
    } 
    
    if (req.method === 'DELETE') {
        await prisma.userSubjectSubscription.deleteMany({ where });
        return res.status(204).end();
    } 
    
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
} 