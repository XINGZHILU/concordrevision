// File: pages/api/admin/users/[id]/toggle-teacher-status.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get user from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get target user ID from URL parameter
        const { id } = req.query;
        const targetUserId = id as string;

        if (!targetUserId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Get data from request body
        const { teacher } = req.body;

        // Update user role
        const user = await prisma.user.update({
            where: { id: targetUserId },
            data: {
                teacher: teacher === true,
            },
        });

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error updating user role:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}