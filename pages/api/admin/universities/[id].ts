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

    if (!user || !user.admin) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { id } = req.query;

    if (req.method === "PUT") {
        const { name, uk } = req.body;
        const university = await prisma.university.update({
            where: { id: id as string },
            data: { name, uk },
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