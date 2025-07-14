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

    if (req.method === "POST") {
        const { id, name, uk } = req.body;
        if (!id || !name) {
            return res.status(400).json({ error: "ID and name are required." });
        }

        try {
            const university = await prisma.university.create({
                data: {
                    id,
                    name,
                    uk: uk || false,
                    description: "",
                },
            });
            return res.status(201).json(university);
        } catch (error) {
            console.error(error);
            // @ts-expect-error P2002 is a Prisma error code for unique constraint violation
            if (error.code === 'P2002') {
                return res.status(409).json({ error: "A university with this ID already exists." });
            }
            return res.status(500).json({ error: "Failed to create university." });
        }
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
} 