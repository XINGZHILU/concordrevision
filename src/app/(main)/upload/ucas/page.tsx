import UCASUploadForm from "@/lib/customui/Upload/UCASUploadForm";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

/**
 * Page for uploading UCAS posts
 */
export default async function Page() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const tags = await prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  const universities = await prisma.university.findMany({
    include: {
      courses: {
        include: {
          ucasSubject: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
  const ucasSubjects = await prisma.uCASSubject.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  const formattedUniversities = universities.map(uni => ({
    id: uni.id,
    name: uni.name,
    uk: uni.uk,
    description: uni.description,
    ucasSubjects: uni.courses.map(c => c.ucasSubject)
  }));

  return (
    <div className="w-11/12 mx-auto">
      <UCASUploadForm
        author={user.id}
        tags={tags}
        universities={formattedUniversities}
        ucasSubjects={ucasSubjects}
      />
    </div>
  );
}