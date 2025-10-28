import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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
    const now = new Date();

    // Fetch all upcoming tests with their associated subject
    const upcomingTests = await prisma.test.findMany({
      where: {
        date: {
          gte: now,
        },
      },
      include: {
        subject: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return res.status(200).json(upcomingTests);
  } catch (error) {
    console.error('Error fetching upcoming tests:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

