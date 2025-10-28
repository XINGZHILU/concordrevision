import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getAuth } from '@clerk/nextjs/server';

const updateStatsSchema = z.object({
  year: z.number().int(),
  applied: z.number().int(),
  accepted: z.number().int(),
});

/**
 * API handler for updating and deleting admission statistics by teachers
 * Handles PUT and DELETE requests for specific admission stats
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify user is a teacher or admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || (!user.admin && !user.teacher)) {
    return res.status(403).json({ error: 'Forbidden - Teacher access required' });
  }

  const { id } = req.query;
  const statId = Number(id);

  if (req.method === 'PUT') {
    try {
      const parsedData = updateStatsSchema.parse(req.body);
      const updatedStat = await prisma.admissionStats.update({
        where: { id: statId },
        data: parsedData,
      });
      res.status(200).json(updatedStat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation Error', errors: error.issues });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.admissionStats.delete({
        where: { id: statId },
      });
      res.status(204).end();
    } catch {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

