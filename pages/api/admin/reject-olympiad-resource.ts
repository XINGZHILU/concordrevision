// File: pages/api/admin/reject-olympiad-resource.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

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
        select: { teacher: true }
    });

    if (!user || !user.teacher) {
        return res.status(403).json({ error: 'Forbidden - Teacher access required' });
    }

    try {
        // Get resource ID from request body
        const { resourceId } = req.body;

        if (!resourceId) {
            return res.status(400).json({ error: 'Resource ID is required' });
        }

        // Delete the olympiad resource
        await prisma.olympiad_Resource.delete({
            where: {
                id: resourceId,
            },
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error rejecting olympiad resource:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}