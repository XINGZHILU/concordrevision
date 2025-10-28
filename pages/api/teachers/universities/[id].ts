import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

/**
 * API handler for individual university management by teachers
 * Handles PUT and DELETE requests for specific universities
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify user is a teacher or admin
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || (!user.admin && !user.teacher)) {
        return res.status(403).json({ error: "Forbidden - Teacher access required" });
    }

    const { id } = req.query;

    if (req.method === "PUT") {
        const { name, uk, description } = req.body;
        const university = await prisma.university.update({
            where: { id: id as string },
            data: { name, uk, description },
        });
        return res.status(200).json(university);
    }

    if (req.method === "DELETE") {
        await prisma.university.delete({
            where: { id: id as string },
        });
        return res.status(204).end();
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}

