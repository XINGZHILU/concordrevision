import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const urls = req.body.urls as string[];
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const olympiad = req.body.olympiad as number;
    const author = req.body.author as string;
    const names = req.body.names as string[];

    const o_r = await prisma.olympiad_Resource.create({
        data: {
            title: title,
            olympiadId: olympiad,
            desc: desc,
            authorId: author
        }
    });

    for (let i = 0; i < urls.length; i++) {
        await prisma.storageFile.create({
            data: {
                filename: names[i],
                path: urls[i],
                olympiadId: o_r.id,
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