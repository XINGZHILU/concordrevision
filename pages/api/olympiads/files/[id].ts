import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from '@/lib/utils/supabase/client';

/**
 * API endpoint for deleting files from olympiad resources
 * DELETE - Remove a file from an olympiad resource
 * Only allows authors, admins, and teachers to delete files
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

        // Get user from database to check permissions
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, admin: true, teacher: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Extract file ID from request body
        const { fileId } = req.body;

        // Validate required fields
        if (!fileId) {
            return res.status(400).json({ error: 'File ID is required' });
        }

        // Get the file with its associated olympiad resource
        const file = await prisma.storageFile.findUnique({
            where: {
                id: fileId
            },
            include: {
                olympiad_resource: {
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

        if (!file.olympiad_resource) {
            return res.status(404).json({ error: 'Associated olympiad resource not found' });
        }

        // Check if current user is the author, admin, or teacher
        if (file.olympiad_resource.authorId !== userId && !user.admin && !user.teacher) {
            return res.status(403).json({ error: 'You do not have permission to delete this file' });
        }

        // Delete the file from storage (Supabase)
        try {
            const supabase = createClient();
            // Extract the path from the full URL
            const urlParts = file.path.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            await supabase.storage
                .from('olympiads-storage')
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

