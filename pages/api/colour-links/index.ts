import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { Colour } from "@prisma/client";

/**
 * API endpoint for managing colour links for revision resources
 * POST - Create or update a colour link for a note
 * Unified endpoint that handles both creation and updates
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { noteId, subjectId, colour } = req.body as { noteId: number, subjectId: number, colour: Colour };

        // Validate required fields
        if (!noteId || !subjectId || !colour) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if a colour link already exists for this user and note
        const existingLink = await prisma.colourLink.findFirst({
            where: {
                userId,
                noteId,
            }
        });

        // Handle deletion if colour is "Unclassified"
        if (colour === "Unclassified") {
            if (existingLink) {
                await prisma.colourLink.delete({ 
                    where: { id: existingLink.id } 
                });
            }
        } else {
            // Update existing link or create new one
            if (existingLink) {
                await prisma.colourLink.update({
                    where: { id: existingLink.id },
                    data: { colour },
                });
            } else {
                await prisma.colourLink.create({
                    data: {
                        userId,
                        noteId,
                        subjectId,
                        colour,
                    }
                });
            }
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error updating colour link:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

