import {prisma} from "@/lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const colour = req.body.colour as number;


    if (colour === 0){
        const updated = await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                greenUIDs: {
                    push: uid
                }
            }
        });
        console.log(updated);
    }
    else if (colour === 1){
        const updated = await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                amberUIDs: {
                    push: uid
                }
            }
        });
        console.log(updated);
    }
    else if (colour === 2){
        const updated = await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                redUIDs: {
                    push: uid
                }
            }
        });
        console.log(updated);
    }

    res.status(200).json({});
}