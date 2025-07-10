// File: pages/api/admin/approve-olympiad-resource.ts

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

    // Check if user is a teacher
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { teacher: true, admin : true }
    });

    if (!user || (!user.teacher && !user.admin)) {
        return res.status(403).json({ error: 'Forbidden - Teacher access required' });
    }

    try {
        // Get resource ID from request body
        const { resourceId } = req.body;

        if (!resourceId) {
            return res.status(400).json({ error: 'Resource ID is required' });
        }

        // Update olympiad resource approval status
        const updatedResource = await prisma.olympiad_Resource.update({
            where: {
                id: resourceId,
            },
            data: {
                approved: true,
            },
            include: {
                author: true,
                olympiad: true
            }
        });

        try {
            await resend.emails.send({
                from: email_from,
                to: [updatedResource.author.email],
                subject: 'Upload approved',
                react: ApprovedEmailTemplate({
                    name: updatedResource.author.firstname || "User",
                    title: updatedResource.title,
                    area: updatedResource.olympiad.title
                }),
            });
        }
        finally {
            console.log('Email send attempted');
        }

        return res.status(200).json({ success: true, resource: updatedResource });
    } catch (error) {
        console.error('Error approving olympiad resource:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}