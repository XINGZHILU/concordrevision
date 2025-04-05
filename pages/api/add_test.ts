import { prisma } from "@/lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const subject = req.body.subject as number;
    const type = req.body.type as string;
    const date = req.body.date as string;

    const test_date = new Date(date);
    console.log(req.body);

    await prisma.test.create({
        data: {
            title: title,
            subjectId: subject,
            desc: desc,
            type: +type,
            date: test_date
        }
    })

    res.status(200).json({});

}

export const config = {
    api: {
        bodyParser: true,
    },
};