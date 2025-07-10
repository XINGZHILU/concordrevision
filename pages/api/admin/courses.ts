import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = getAuth(req);
  console.log(auth);
  if (!auth || !auth.userId){
    return res.status(403).json({ error: 'Not authorized' });
  }
  const record = await prisma.user.findUnique({
    where: {
      id : auth.userId
    }
  });

  if (!record){
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (!record.admin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        universityId,
        qualification,
        duration_years,
        summary,
        entry_requirements_text,
        alevel_requirements,
        ib_requirements,
        required_subjects,
        recommended_subjects,
        url,
        slug,
      } = req.body;

      // Basic validation
      if (!name || !universityId || !qualification || !duration_years || !summary || !entry_requirements_text) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newCourse = await prisma.ucasCourse.create({
        data: {
          id: `${universityId}-${name.toLowerCase().replace(/ /g, '-')}`,
          name,
          universityId,
          qualification,
          duration_years: parseInt(duration_years, 10),
          summary,
          entry_requirements_text,
          alevel_requirements,
          ib_requirements,
          required_subjects,
          recommended_subjects,
          url,
          slug,
        },
      });
      res.status(201).json(newCourse);
    } catch (error) {
      console.error('Failed to create course:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
