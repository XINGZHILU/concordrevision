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

    // Get olympiad ID from request
    const { id } = req.query;
    const olympiadId = parseInt(id as string);

    if (isNaN(olympiadId)) {
        return res.status(400).json({ error: 'Invalid olympiad ID' });
    }

    // Handle PUT request (update olympiad)
    if (req.method === 'PUT') {
        try {
            // Get data from request body
            const { title, desc, area, links, link_descriptions } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Olympiad title is required' });
            }

            if (!area) {
                return res.status(400).json({ error: 'Subject area is required' });
            }

            // Update olympiad
            const olympiad = await prisma.olympiad.update({
                where: { id: olympiadId },
                data: {
                    title,
                    desc: desc || '',
                    area,
                    links: links || [],
                    link_descriptions: link_descriptions || [],
                },
            });

            return res.status(200).json({ success: true, olympiad });
        } catch (error) {
            console.error('Error updating olympiad:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
        try {
            // Check if olympiad has associated resources
            const olympiadWithCount = await prisma.olympiad.findUnique({
                where: { id: olympiadId },
                include: {
                    _count: {
                        select: { resources: true }
                    }
                }
            });

            if (!olympiadWithCount) {
                return res.status(404).json({ error: 'Olympiad not found' });
            }

            if (olympiadWithCount._count.resources > 0) {
                return res.status(400).json({
                    error: 'Cannot delete olympiad with associated resources'
                });
            }

            // Delete olympiad
            await prisma.olympiad.delete({
                where: { id: olympiadId },
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error deleting olympiad:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
}