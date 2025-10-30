import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

/**
 * API endpoint for fetching upcoming tests
 * GET - Returns all upcoming tests ordered by date
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptions: true
      }
    });

    if (!dbUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    const now = new Date();

    // Fetch all upcoming tests with their associated subject
    const upcomingTests: {
      id: number;
      title: string;
      subjectId: number;
      desc: string;
      type: number;
      topics: string[];
      date: Date;
    }[] = [];

    for (const subscription of dbUser.subscriptions) {
      const subject = await prisma.subject.findUnique({
        where: {
          id: subscription.subjectId
        },
        select: {
          tests: {
            include: {
              subject: true
            }
          }
        }
      });
      if (!subject) {
        return res.status(401).json({ error: 'Subject not found' });
      }
      for (const test of subject.tests) {
        if (test.date.getTime() >= now.getTime()) {
          upcomingTests.push(test);
        }
      }
    }

    // Sort tests by date (earliest first)
    upcomingTests.sort((a, b) => a.date.getTime() - b.date.getTime());

    return res.status(200).json(upcomingTests);
  } catch (error) {
    console.error('Error fetching upcoming tests:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

