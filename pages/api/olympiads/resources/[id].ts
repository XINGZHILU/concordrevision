import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

/**
 * API endpoint for managing individual olympiad resources
 * PUT - Update an existing olympiad resource
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow PUT requests
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { resourceId, title, desc, newFiles } = req.body;

        // Validate required fields
        if (!resourceId) {
            return res.status(400).json({ error: 'Resource ID is required' });
        }

        // Get the resource and verify ownership
        const resource = await prisma.olympiad_Resource.findUnique({
            where: { id: resourceId },
            select: { authorId: true }
        });

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Check if user is the author or an admin
        if (resource.authorId !== userId && !user.admin) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Update the resource
        const updatedResource = await prisma.olympiad_Resource.update({
            where: {
                id: resourceId,
            },
            data: {
                title: title,
                desc: desc,
                files: newFiles ? {
                    create: newFiles.urls.map((url: string, index: number) => ({
                        filename: newFiles.names[index],
                        path: url,
                        type: newFiles.names[index].split('.').pop() || 'file'
                    }))
                } : undefined
            },
        });

        return res.status(200).json(updatedResource);
    } catch (error) {
        console.error('Error updating resource:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

