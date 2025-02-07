import {prisma} from "@/lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const original = req.body.original as number;


    const note = await prisma.note.findUnique({
        where: {
            id: nid
        }
    });
    if (!note){
        res.status(404).json({error: 'Note not found'});
        return;
    }
    if (original === 0){
        await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                greenUIDs: {
                    set: note.greenUIDs.filter((id) => id !== uid)
                }
            }
        });
    }
    else if (original === 1){
        await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                amberUIDs: {
                    set: note.amberUIDs.filter((id) => id !== uid)
                }
            }
        });
    }
    else if (original === 2){
        await prisma.note.update({
            where: {
                id: nid
            },
            data: {
                redUIDs: {
                    set: note.redUIDs.filter((id) => id !== uid)
                }
            }
        });
    }
    console.log(`${nid} original colour removed`);

    res.status(200).json({});
}