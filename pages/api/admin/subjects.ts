// File: pages/api/admin/subjects/[id].ts

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

    // Get subject ID from request


    // Handle PUT request (update subject)
    if (req.method === 'PUT') {
        try {
            // Get data from request body
            const { title, desc, level, id } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid subject ID' });
            }

            if (!title) {
                return res.status(400).json({ error: 'Subject title is required' });
            }

            // Update subject
            const subject = await prisma.subject.update({
                where: { id: id },
                data: {
                    title,
                    desc: desc || '',
                    level: level || 0,
                },
            });

            return res.status(200).json({ success: true, subject });
        } catch (error) {
            console.error('Error updating subject:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
}