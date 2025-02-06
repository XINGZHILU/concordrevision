import {prisma} from "@/lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const nid = req.body.nid as number;
    const uid = req.body.uid as string;
    const colour = req.body.colour as number;
    const original = req.body.original as number;

    console.log(colour);

    if (original >= 0){
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
    }
    if (colour >= 0){
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
            await prisma.note.update({
                where: {
                    id: nid
                },
                data: {
                    greenUIDs: note.greenUIDs
                }
            });
        }
        else if (colour === 1){
            note.amberUIDs.push(uid);
            await prisma.note.update({
                where: {
                    id: nid
                },
                data: {
                    amberUIDs: note.amberUIDs
                }
            });
        }
        else if (colour === 2){
            note.redUIDs.push(uid);
            await prisma.note.update({
                where: {
                    id: nid
                },
                data: {
                    redUIDs: note.redUIDs
                }
            });
        }
    }

    res.status(200).json({});
}