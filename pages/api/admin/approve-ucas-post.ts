import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Resend } from 'resend';
import { UCASPostApprovedEmailTemplate } from "@/email/email-templates";
import { email_from } from "@/lib/consts";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (!user.teacher && !user.admin)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        const updatedPost = await prisma.uCASPost.update({
            where: {
                id: postId,
            },
            data: {
                approved: true,
            },
            include: {
                author: true,
            },
        });

        try {
            await resend.emails.send({
                from: email_from,
                to: [updatedPost.author.email],
                subject: 'UCAS Post Approved',
                // @ts-expect-error React 18 template issue
                react: UCASPostApprovedEmailTemplate({
                    name: updatedPost.author.firstname || "User",
                    title: updatedPost.title
                }),
            });
        }
        finally {
            console.log('Email send attempted for UCAS post approval');
        }

        return res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Error approving UCAS post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 