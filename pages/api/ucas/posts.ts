import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { upload_permission: true, teacher: true, admin: true },
  });

  if (!dbUser || (!dbUser.upload_permission && !dbUser.teacher && !dbUser.admin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "POST") {
    const { title, content, files, tags, universities, courses } = req.body;

    const post = await prisma.uCASPost.create({
      data: {
        title,
        content,
        authorId: userId,
        approved: dbUser.teacher || dbUser.admin,
        tags,
        universities,
        courses,
        files: files && files.length > 0 ? {
          create: files.map((file: { name: string; url: string; }) => ({
            filename: file.name,
            path: file.url,
            type: file.name.split('.').pop() || 'file'
          }))
        } : undefined
      },
    });

    return res.status(201).json(post);
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 