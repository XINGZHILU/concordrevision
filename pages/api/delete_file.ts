import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/client";

/**
 * API endpoint for deleting files from revision resources
 * Only allows authors to delete files from their own resources
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow DELETE requests
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get authenticated user
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract file ID from request body
        const { fileId } = req.body;

        // Validate required fields
        if (!fileId) {
            return res.status(400).json({ error: 'File ID is required' });
        }

        // Get the file with its associated note
        const file = await prisma.storageFile.findUnique({
            where: {
                id: fileId
            },
            include: {
                note: {
                    select: {
                        id: true,
                        authorId: true,
                        title: true
                    }
                }
            }
        });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (!file.note) {
            return res.status(404).json({ error: 'Associated note not found' });
        }

        // Check if current user is the author of the note
        if (file.note.authorId !== userId) {
            return res.status(403).json({ error: 'You can only delete files from your own resources' });
        }

        // Delete the file from storage (Supabase)
        try {
            const supabase = createClient();
            // Extract the path from the full URL
            const urlParts = file.path.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            await supabase.storage
                .from('notes-storage')
                .remove([fileName]);
        } catch (storageError) {
            console.error('Storage deletion error:', storageError);
            // Continue with database deletion even if storage fails
        }

        // Delete the file record from database
        await prisma.storageFile.delete({
            where: {
                id: fileId
            }
        });

        return res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });

    } catch (error) {
        console.error('Delete file error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 