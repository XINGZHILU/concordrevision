import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

/**
 * API endpoint for managing individual revision resources (Notes)
 * PUT - Update an existing resource
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow PUT requests
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get authenticated user
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract data from request body
        const { 
            noteId, 
            title, 
            desc, 
            newFiles 
        } = req.body;

        // Validate required fields
        if (!noteId || !title) {
            return res.status(400).json({ error: 'Note ID and title are required' });
        }

        // Check if the note exists and belongs to the current user
        const existingNote = await prisma.note.findUnique({
            where: {
                id: noteId
            }
        });

        const userRecord = await prisma.user.findUnique({
          where: {
            id: userId
          }
        });

        if (!existingNote || !userRecord) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Verify user is the author or an admin
        if (existingNote.authorId !== userId && !userRecord.admin) {
            return res.status(403).json({ error: 'You can only edit your own resources' });
        }

        // Update the note
        const updatedNote = await prisma.note.update({
            where: {
                id: noteId
            },
            data: {
                title: title,
                desc: desc || "",
            }
        });

        // Add new files if provided
        if (newFiles && newFiles.urls && newFiles.names) {
            const filePromises = newFiles.urls.map((url: string, index: number) => {
                return prisma.storageFile.create({
                    data: {
                        filename: newFiles.names[index],
                        path: url,
                        noteId: noteId,
                        type: "pdf"
                    }
                });
            });

            await Promise.all(filePromises);
        }

        return res.status(200).json({
            success: true,
            note: updatedNote
        });

    } catch (error) {
        console.error('Update resource error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

