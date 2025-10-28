import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    // Allow both admins and teachers to toggle pin status
    if (!user || (!user.admin && !user.teacher)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { id } = req.query;

    if (req.method === "PUT") {
        const resource = await prisma.olympiad_Resource.findUnique({
            where: { id: parseInt(id as string) },
        });

        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }

        const updatedResource = await prisma.olympiad_Resource.update({
            where: { id: parseInt(id as string) },
            data: { pinned: !resource.pinned },
        });
        return res.status(200).json(updatedResource);
    }

    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
} 