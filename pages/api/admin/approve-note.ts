// File: pages/api/admin/approve-note.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Resend } from 'resend';
import { ApprovedEmailTemplate } from "@/email/email-templates";
import { email_from } from "@/lib/consts";

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

        // Update note approval status
        const updatedNote = await prisma.note.update({
            where: {
                id: noteId,
            },
            data: {
                approved: true,
            },
            include: {
                author: true,
                subject: true
            },
        });

        try {
            await resend.emails.send({
                from: email_from,
                to: [updatedNote.author.email],
                subject: 'Upload approved',
                react: ApprovedEmailTemplate({
                    name: updatedNote.author.firstname || "User",
                    title: updatedNote.title,
                    area: updatedNote.subject.title
                }),
            });
        }
        finally {
            console.log('Email send attempted');
        }

        return res.status(200).json({ success: true, note: updatedNote });
    } catch (error) {
        console.error('Error approving note:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}