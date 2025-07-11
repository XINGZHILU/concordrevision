import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UCASPostList } from "@/lib/customui/UCAS/UCASPostList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Page({ params }: { params: { uid: string, cid: string } }) {
  const page_params = await params;
  const course = await prisma.ucasCourse.findUnique({

    where: {
      id: `${page_params.uid}-${page_params.cid}`,
      universityId: page_params.uid,
      slug: page_params.cid
    },
    include: {
      university: true,
    }
  });

  if (!course) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      type: 2,
      courseId: course.id
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
      <h1 className="text-3xl font-bold">{course.name}</h1>
      <h2 className="text-xl text-muted-foreground mb-6">
        <a href={`/ucas/${course.university.id}`} className="hover:underline">{course.university.name}</a>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Accordion type="multiple" defaultValue={['summary', 'entry']} className="w-full">
            <AccordionItem value="summary">
              <AccordionTrigger><h3>Summary</h3></AccordionTrigger>
              <AccordionContent>
                {course.summary}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="entry">
              <AccordionTrigger><h3>Entry Requirements</h3></AccordionTrigger>
              <AccordionContent>
                <p>{course.entry_requirements_text}</p>
                {course.alevel_requirements && <p><strong>A-Level:</strong> {course.alevel_requirements}</p>}
                {course.ib_requirements && <p><strong>IB:</strong> {course.ib_requirements}</p>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Qualification:</strong> {course.qualification}</p>
              <p><strong>Duration:</strong> {course.duration_years} years</p>
              <div>
                <strong>Required Subjects:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {course.required_subjects.map(s => <Badge key={s}>{s}</Badge>)}
                </div>
              </div>
              {course.recommended_subjects.length > 0 && (
                <div>
                  <strong>Recommended Subjects:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {course.recommended_subjects.map(s => <Badge variant="secondary" key={s}>{s}</Badge>)}
                  </div>
                </div>
              )}
              {course.url && <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">More Info</a>}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Posts about this course</h3>
        <UCASPostList posts={posts} />
      </div>
    </div>
  );
}