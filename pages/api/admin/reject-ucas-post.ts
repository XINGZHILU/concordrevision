import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { Resend } from 'resend';
import { UCASPostRejectedEmailTemplate } from "@/email/email-templates";
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

        const deletedPost = await prisma.uCASPost.delete({
            where: {
                id: postId,
            },
            include: {
                author: true,
            },
        });

        try {
            await resend.emails.send({
                from: email_from,
                to: [deletedPost.author.email],
                subject: 'UCAS Post Rejected',
                // @ts-expect-error React 18 template issue
                react: UCASPostRejectedEmailTemplate({
                    name: deletedPost.author.firstname || "User",
                    title: deletedPost.title
                }),
            });
        }
        finally {
            console.log('Email send attempted for UCAS post rejection');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error rejecting UCAS post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 