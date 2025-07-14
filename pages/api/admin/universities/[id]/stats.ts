import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const createStatsSchema = z.object({
  year: z.number().int(),
  applied: z.number().int(),
  accepted: z.number().int(),
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const parsedData = createStatsSchema.parse(req.body);

      const stats = await prisma.admissionStats.create({
        data: {
          ...parsedData,
          universityId: id as string,
        },
      });

      res.status(201).json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation Error', errors: error.issues });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 