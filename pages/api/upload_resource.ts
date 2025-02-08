import { put } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const filename = req.query.filename as string;
    const subject = req.query.subject as string;
    const desc = req.query.desc as string;
    if (!filename){
        res.status(404).json({});
    }
    const blob = await put(filename, req, {
        access: 'public',
    });
    const url = blob.url;

    await prisma.note.create({
        data : {
            title: req.query.title as string,
            subjectId: +subject,
            filename: url,
            authorId: req.query.author as string,
            desc: desc,
        }
    })

    res.status(200).json({});
}

export const config = {
    api: {
        bodyParser: false,
    },
};