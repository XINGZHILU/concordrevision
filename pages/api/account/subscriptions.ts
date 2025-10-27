import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API endpoint to fetch all user subscriptions
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const subscriptions = await prisma.userSubjectSubscription.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                subjectId: true,
                test_notification: true,
                resource_notification: true,
            },
            orderBy: {
                subjectId: 'asc',
            },
        });

        return res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return res.status(500).json({ message: 'Error fetching subscriptions' });
    }
}
