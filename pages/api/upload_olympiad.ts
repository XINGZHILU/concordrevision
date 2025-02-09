import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const url = req.body.url as string;
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const olympiad = req.body.olympiad as number;
    const author = req.body.author as string;

    await prisma.olympiad_Resource.create({
        data: {
            title: title,
            olympiadId: olympiad,
            filename: url,
            desc: desc,
            authorId: author
        }
    });

    res.status(200).json({});
}

export const config = {
    api: {
        bodyParser: true,
    },
};