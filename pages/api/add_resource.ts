import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const urls = req.body.urls as string[];
    const names = req.body.names as string[];
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const subject = req.body.subject as number;
    const author = req.body.author as string;
    const type = req.body.type as number;

    const note = await prisma.note.create({
        data: {
            title: title,
            subjectId: subject,
            authorId: author,
            desc: desc,
            type: type
        }
    })

    for (let i = 0; i < urls.length; i++) {
        await prisma.storageFile.create({
            data: {
                filename: names[i],
                path: urls[i],
                noteId: note.id,
            }
        });
    }

    res.status(200).json({});
}

export const config = {
    api: {
        bodyParser: true,
    },
};