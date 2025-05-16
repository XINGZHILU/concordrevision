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

  const recordId = req.query.id as string

  if (!recordId) {
    return res.status(400).json({ message: "Record ID is required" })
  }

  try {
    // Check if the record exists and belongs to the current user
    const record = await prisma.pastPaperRecord.findUnique({
      where: { id: recordId }
    })

    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }

    if (record.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to access this record" })
    }

    // PATCH - Update a record (for updating paper status)
    if (req.method === "PATCH") {
      const { papers_finished, paper_marks, max_marks, notes } = req.body

      const updatedRecord = await prisma.pastPaperRecord.update({
        where: { id: recordId },
        data: { 
          papers_finished,
          paper_marks,
          max_marks,
          notes
        }
      })

      return res.status(200).json(updatedRecord)
    } 
    
    // DELETE - Remove a record
    else if (req.method === "DELETE") {
      await prisma.pastPaperRecord.delete({
        where: { id: recordId }
      })

      return res.status(204).end()
    } 
    
    // GET - Retrieve a single record
    else if (req.method === "GET") {
      const record = await prisma.pastPaperRecord.findUnique({
        where: { id: recordId },
        include: { subject: true }
      })

      return res.status(200).json(record)
    } 
    
    else {
      return res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Error handling record request:", error)
    return res.status(500).json({ message: "Server error" })
  }
} 