import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { upload_permission: true, teacher: true },
  });

  if (!dbUser || (!dbUser.upload_permission && !dbUser.teacher)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "POST") {
    const { title, content, type, universityId, courseId, files } = req.body;

    const post = await prisma.uCASPost.create({
      data: {
        title,
        content,
        type,
        universityId,
        courseId,
        authorId: userId,
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

  if (req.method === "PUT") {
    const { id, title, content } = req.body;
    
    const post = await prisma.uCASPost.findUnique({ where: { id: parseInt(id) } });

    if (!post || post.authorId !== userId) {
      return res.status(404).json({ error: "Post not found or permission denied" });
    }

    const updatedPost = await prisma.uCASPost.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    return res.status(200).json(updatedPost);
  }

  res.setHeader("Allow", ["POST", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default handler; 