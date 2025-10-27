import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

/**
 * API endpoint to fetch upcoming tests for user's subscribed subjects
 * Returns tests ordered by date (earliest first), limited to 100 tests
 * Frontend component limits display to 8 unique dates with all tests on those dates
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
        // Get user's subscribed subjects
        const subscriptions = await prisma.userSubjectSubscription.findMany({
            where: {
                userId,
                test_notification: true, // Only include subjects where user wants test notifications
            },
            select: {
                subjectId: true,
            },
        });

        const subscribedSubjectIds = subscriptions.map(sub => sub.subjectId);

        if (subscribedSubjectIds.length === 0) {
            return res.status(200).json([]);
        }

        // Get upcoming tests for subscribed subjects
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const upcomingTests = await prisma.test.findMany({
            where: {
                subjectId: {
                    in: subscribedSubjectIds,
                },
                date: {
                    gte: today, // Tests from today onwards
                },
            },
            include: {
                subject: {
                    select: {
                        id: true,
                        title: true,
                        level: true,
                    },
                },
            },
            orderBy: {
                date: 'asc', // Earliest tests first
            },
            take: 100, // Fetch up to 100 tests to ensure we cover multiple dates (frontend limits display)
        });

        return res.status(200).json(upcomingTests);
    } catch (error) {
        console.error('Error fetching upcoming tests:', error);
        return res.status(500).json({ message: 'Error fetching upcoming tests' });
    }
}
