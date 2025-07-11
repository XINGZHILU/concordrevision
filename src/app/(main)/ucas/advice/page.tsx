import { UCASPostList } from "@/lib/customui/UCAS/UCASPostList";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AdvicePage() {
  const user = await currentUser();
  if (!user){
    notFound();
  }
  const posts = await prisma.uCASPost.findMany({
    where: {
      type: 0
    },
    include: {
      author: true,
      files: true
    },
    orderBy: {
      uploadedAt: 'desc'
    }
  });
  return (
    <div className="w-11/12 mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">UCAS Advice</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Read and share advice on personal statements, interviews, and university life.
      </p>

      <UCASPostList posts={posts} />
    </div>
  )
} 