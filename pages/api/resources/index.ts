import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import sendNewResource from '@/lib/email/send_new_resource';

/**
 * API endpoint for creating revision resources (Notes)
 * POST - Create a new resource with files
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate user
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify user exists in database
    const record = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });

    if (!record) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract data from request body
    const urls = req.body.urls as string[];
    const names = req.body.names as string[];
    const title = req.body.title as string;
    const desc = req.body.desc as string;
    const subject = req.body.subject as number;
    const author = req.body.author as string;
    const type = req.body.type as number;

    // Create the note resource
    const note = await prisma.note.create({
        data: {
            title: title,
            subjectId: subject,
            authorId: author,
            desc: desc,
            type: type,
            approved: record.teacher || record.admin || record.check_waiver
        },
        include: {
          subject:{
            include: {
              subscribers: {
                include: {
                  user: true
                }
              }
            }
          }
        }
    })

    // Create associated files
    for (let i = 0; i < urls.length; i++) {
        await prisma.storageFile.create({
            data: {
                filename: names[i],
                path: urls[i],
                noteId: note.id,
            },
        });
    }

    // Send notification email if approved
    if (note.approved){
      await sendNewResource(note);
    }

    res.status(200).json({ approved: note.approved });
}

export const config = {
    api: {
        bodyParser: true,
    },
};

