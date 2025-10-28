import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

/**
 * API endpoint for adding notes to a specific test
 * POST - Create a new note associated with a test
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
  const test = req.body.test as number;

  // Create the note linked to the test
  const note = await prisma.note.create({
    data: {
      title: title,
      subjectId: subject,
      authorId: author,
      desc: desc,
      type: type,
      testId: test,
      approved: record.teacher || record.admin || record.check_waiver
    }
  })

  // Create associated files
  for (let i = 0; i < urls.length; i++) {
    await prisma.storageFile.create({
      data: {
        filename: names[i],
        path: urls[i],
        noteId: note.id,
      }
    });
  }

  res.status(200).json({ approved: record.teacher });
}

export const config = {
  api: {
    bodyParser: true,
  },
};

