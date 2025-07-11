import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const original = req.body.original as number;


    const user = await prisma.user.findUnique({
        where: {
            id: uid
        }
    });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    if (original === 0) {
        await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                green: {
                    set: user.green.filter((id) => id !== nid)
                }
            }
        });
    }
    else if (original === 1) {
        await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                amber: {
                    set: user.amber.filter((id) => id !== nid)
                }
            }
        });
    }
    else if (original === 2) {
        await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                red: {
                    set: user.red.filter((id) => id !== nid)
                }
            }
        });
    }
    //console.log(`${nid} original colour removed`);

    res.status(200).json({});
}