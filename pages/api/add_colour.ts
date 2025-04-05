import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const colour = req.body.colour;

    if (colour === '0') {
        await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                green: {
                    push: nid
                }
            }
        });
    } else if (colour === '1') {
        await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                amber: {
                    push: nid
                }
            }
        });
    } else if (colour === '2') {
        await prisma.user.update({
            where: {
                id: uid
            },
            data: {
                red: {
                    push: nid
                }
            }
        });
    }

    res.status(200).json({});
}