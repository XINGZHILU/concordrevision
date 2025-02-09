import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const url = req.body.url as string;
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const subject = req.body.subject as number;
    const author = req.body.author as string;
    const type = req.body.type as number;
    const test = req.body.test as number;

    await prisma.note.create({
        data: {
            title: title,
            subjectId: subject,
            filename: url,
            authorId: author,
            desc: desc,
            type: type,
            testId: test
        }
    })

    res.status(200).json({});
}

export const config = {
    api: {
        bodyParser: true,
    },
};