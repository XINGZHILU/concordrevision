import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const record = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });

    if (!record) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const urls = req.body.urls as string[];
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const olympiad = req.body.olympiad as number;
    const author = req.body.author as string;
    const names = req.body.names as string[];

    const resource = await prisma.olympiad_Resource.create({
        data: {
            title: title,
            olympiadId: olympiad,
            desc: desc,
            authorId: author,
            approved: record.teacher || record.admin
        }
    });

    for (let i = 0; i < urls.length; i++) {
        await prisma.storageFile.create({
            data: {
                filename: names[i],
                path: urls[i],
                olympiadId: resource.id,
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