import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { Colour } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === 'POST') {
        return await handlePost(req, res, userId);
    }
    
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {
        const { noteId, subjectId, colour } = req.body as { noteId: number, subjectId: number, colour: Colour };

        if (!noteId || !subjectId || !colour) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingLink = await prisma.colourLink.findFirst({
            where: {
                userId,
                noteId,
            }
        });

        if (colour === "Unclassified") {
            if (existingLink) {
                await prisma.colourLink.delete({ where: { id: existingLink.id } });
            }
        } else {
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