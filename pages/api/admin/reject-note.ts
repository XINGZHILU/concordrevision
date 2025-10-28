import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Resend } from 'resend';
import { RejectedResourceEmailTemplate } from '@/lib/email/email-templates';
import { fromDept } from "@/lib/consts";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    try {
        // Get note ID from request body
        const { noteId } = req.body;

        if (!noteId) {
            return res.status(400).json({ error: 'Note ID is required' });
        }

        // Delete the note (or alternatively, you could update a status field to 'rejected' if you want to keep records)
        const deleted = await prisma.note.delete({
            where: {
                id: noteId,
            },
            include: {
                author: true,
                subject: true
            }
        });

        try {
            await resend.emails.send({
                from: fromDept(deleted.subject.title),
                to: [deleted.author.email],
                subject: 'Upload rejected',
                react: await RejectedResourceEmailTemplate({
                    name: deleted.author.firstname || "User",
                    title: deleted.title,
                    subject: deleted.subject.title,
                    year: deleted.subject.level
                }),
            });
        }
        finally {
            console.log('Email send attempted');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error rejecting note:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}