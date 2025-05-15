import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req)
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.method === "GET") {
    try {
      const subjects = await prisma.subject.findMany({
        orderBy: {
          title: "asc",
        },
      })
      
      return res.status(200).json(subjects)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      return res.status(500).json({ message: "Error fetching subjects" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
} 