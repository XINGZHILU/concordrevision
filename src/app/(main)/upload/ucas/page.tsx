import UCASUploadForm from "@/lib/customui/Upload/UCASUploadForm";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
export default async function Page() {
    const user = await currentUser();

    if (!user){
      notFound();
    }

    const tags = await prisma.tag.findMany();
    const universities = await prisma.university.findMany({
        include: {
            courseLinks: {
                include: {
                    course: true
                }
            }
        }
    });
    const courses = await prisma.course.findMany();

    const formattedUniversities = universities.map(uni => ({
        id: uni.id,
        name: uni.name,
        uk: uni.uk,
        courses: uni.courseLinks.map(cl => cl.course)
    }));

    return (
        <div className="w-11/12 mx-auto">
            <UCASUploadForm
                author={user.id}
                tags={tags}
                universities={formattedUniversities}
                courses={courses}
            />
        </div>
    );
}