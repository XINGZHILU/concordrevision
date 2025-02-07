import {prisma} from "@/lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const colour = req.body.colour;

    if (colour === '0'){
        await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                greenUIDs: {
                    push: uid
                }
            }
        });
    }
    else if (colour === '1'){
        await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                amberUIDs: {
                    push: uid
                }
            }
        });
    }
    else if (colour === '2'){
        await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                redUIDs: {
                    push: uid
                }
            }
        });
    }

    res.status(200).json({});
}