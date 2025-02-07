import {prisma} from "@/lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const colour = req.body.colour as number;

    const note = await prisma.note.findUnique({
        where: {
            id: nid
        }
    });
    if (!note){
        res.status(404).json({error: 'Note not found'});
        return;
    }
    if (colour === 0){
        note.greenUIDs.push(uid);
        const updated = await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                greenUIDs: note.greenUIDs
            }
        });
        console.log(updated);
    }
    else if (colour === 1){
        note.amberUIDs.push(uid);
        const updated = await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                amberUIDs: note.amberUIDs
            }
        });
        console.log(updated);
    }
    else if (colour === 2){
        note.redUIDs.push(uid);
        const updated = await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                redUIDs: note.redUIDs
            }
        });
        console.log(updated);
    }

    res.status(200).json({});
}