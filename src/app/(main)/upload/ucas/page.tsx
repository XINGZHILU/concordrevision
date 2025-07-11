import UCASUploadForm from "@/lib/customui/Upload/UCASUploadForm"
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function UcasUploadPage() {
  const user = await currentUser();
  if (!user) {
    notFound();
  }

  const universities = await prisma.university.findMany({
    select: {
      id: true,
      name: true,
      courses: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Upload UCAS Post</h1>
      <p className="text-muted-foreground">Share your advice and experiences about university applications.</p>
      <div className="mt-6">
        <UCASUploadForm universities={universities} author={user.id} />
      </div>
    </div>
  )
} 