import { prisma } from "@/lib/prisma";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const title = req.body.title as string;
  const content = req.body.content as string;
  const author = req.body.author as string;

  await prisma.post.create({
    data: {
      title: title,
      content: content,
      authorId: author,
    }
  });

  res.status(200).json({});

}

export const config = {
  api: {
    bodyParser: true,
  },
};