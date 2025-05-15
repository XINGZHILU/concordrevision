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

  // GET - Retrieve all past paper records for the current user
  if (req.method === "GET") {
    try {
      const records = await prisma.pastPaperRecord.findMany({
        where: {
          userId: userId,
        },
        include: {
          subject: true,
        },
        orderBy: {
          name: "asc",
        },
      })

      return res.status(200).json(records)
    } catch (error) {
      console.error("Error fetching past paper records:", error)
      return res.status(500).json({ message: "Error fetching past paper records" })
    }
  }

  // POST - Create a new past paper record
  else if (req.method === "POST") {
    const { name, subjectId, specimen, startYear, endYear, paperCount, max_marks } = req.body

    if (!name || !subjectId) {
      return res.status(400).json({ message: "Name and subject are required" })
    }

    try {
      // Check if the subject exists
      const subject = await prisma.subject.findUnique({
        where: {
          id: subjectId,
        },
      })

      if (!subject) {
        return res.status(404).json({ message: "Subject not found" })
      }

      const record = await prisma.pastPaperRecord.create({
        data: {
          name,
          userId,
          subjectId,
          specimen: specimen ?? true,
          start_year: startYear ?? 2015,
          end_year: endYear ?? 2025,
          paper_count: paperCount ?? 3,
          papers_finished: [],
          paper_marks: [],
          max_marks: max_marks || [],
        },
      })

      return res.status(201).json(record)
    } catch (error) {
      console.error("Error creating past paper record:", error)
      return res.status(500).json({ message: "Error creating past paper record" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
} 