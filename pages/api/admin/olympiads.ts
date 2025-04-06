// File: pages/api/admin/olympiads.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get user from Clerk
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle POST request (create new olympiad)
  if (req.method === 'POST') {
    try {
      // Get data from request body
      const { title, desc, area, links } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Olympiad title is required' });
      }

      if (!area) {
        return res.status(400).json({ error: 'Subject area is required' });
      }

      // Create new olympiad
      const olympiad = await prisma.olympiad.create({
        data: {
          title,
          desc: desc || '',
          area,
          links: links || [],
        },
      });

      return res.status(200).json({ success: true, olympiad });
    } catch (error) {
      console.error('Error creating olympiad:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}

