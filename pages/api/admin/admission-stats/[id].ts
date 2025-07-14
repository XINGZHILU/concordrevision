import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const updateStatsSchema = z.object({
  year: z.number().int(),
  applied: z.number().int(),
  accepted: z.number().int(),
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
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