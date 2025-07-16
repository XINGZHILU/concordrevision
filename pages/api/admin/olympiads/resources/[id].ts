import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || !user.admin) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const resourceId = parseInt(req.query.id as string);

    if (req.method === "DELETE") {
        try {
            await prisma.olympiad_Resource.delete({
                where: { id: resourceId },
            });
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete resource" });
        }
    } else {
        res.setHeader("Allow", ["DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 