import { CourseList } from "@/lib/customui/UCAS/CourseList";
import QS_Info from "@/lib/customui/UCAS/fetch_qs";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UCASPostList } from "@/lib/customui/UCAS/UCASPostList";

export default async function Page({ params }: { params: { uid: string } }) {
  const university = await prisma.university.findUnique({
    where: {
      id: params.uid
    },
    include: {
      courses: true,
    }
  });

  if (!university) {
    notFound();
  }

  console.log(university.courses);


  const posts = await prisma.uCASPost.findMany({
    where : {
      type: 1,
      universityId: university.id
    },
    include: {
      author: true
    },
    orderBy: {
      uploadedAt: 'desc'
    }
  })

  return (
    <div className="w-11/12 mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-6">{university.name}</h1>
      
      <Accordion type="multiple" defaultValue={['info', 'courses']} className="w-full">
        <AccordionItem value="info">
          <AccordionTrigger><h2>Information</h2></AccordionTrigger>
          <AccordionContent>
            <QS_Info university={university}/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="courses">
          <AccordionTrigger><h2>Courses</h2></AccordionTrigger>
          <AccordionContent>
            <CourseList courses={university.courses} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="posts">
          <AccordionTrigger><h2>Posts</h2></AccordionTrigger>
          <AccordionContent>
            <UCASPostList posts = {posts}/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}