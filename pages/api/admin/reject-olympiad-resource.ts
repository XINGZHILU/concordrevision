// File: pages/api/admin/reject-olympiad-resource.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Resend } from 'resend';
import { RejectedOlympiadEmailTemplate } from '@/lib/email/email-templates';
import { fromDept } from "@/lib/consts";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Clerk
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if user is a teacher
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { teacher: true, admin: true }
  });

  if (!user || (!user.teacher && !user.admin)) {
    return res.status(403).json({ error: 'Forbidden - Teacher access required' });
  }

  try {
    // Get resource ID from request body
    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }

    // Delete the olympiad resource
    const deleted = await prisma.olympiad_Resource.delete({
      where: {
        id: resourceId,
      },
      include: {
        author: true,
        olympiad: true
      }
    });

    try {
      await resend.emails.send({
        from: fromDept(deleted.olympiad.area),
        to: [deleted.author.email],
        subject: 'Upload rejected',
        react: await RejectedOlympiadEmailTemplate({
          name: deleted.author.firstname || "User",
          title: deleted.title,
          olympiad: deleted.olympiad.title,
          area: deleted.olympiad.area
        }),
      });
    }
    finally {
      console.log('Email send attempted');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error rejecting olympiad resource:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}