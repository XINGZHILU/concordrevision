// File: pages/api/teachers/subjects.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

/**
 * API handler for subject management by teachers
 * Handles PUT requests to update subject descriptions
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Get user from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify user is a teacher or admin
    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!dbUser || (!dbUser.teacher && !dbUser.admin)) {
        return res.status(403).json({ error: 'Forbidden - Teacher access required' });
    }

    // Handle PUT request (update subject)
    if (req.method === 'PUT') {
        try {
            // Get data from request body
            const { desc, id } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid subject ID' });
            }

            // Update subject
            const subject = await prisma.subject.update({
                where: { id: id },
                data: {
                    desc: desc || '',
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

