import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Badge } from "@/lib/components/ui/badge";
import Link from 'next/link';

export default async function UniversityCoursePage({
  params
}: {
  params: { uid: string; cid: string };
}) {
  const page_params = await params;
  const courseLink = await prisma.courseLink.findUnique({
    where: {
      id: parseInt(page_params.cid)
    },
    include: {
      university: true,
      course: true
    }
  });

  if (!courseLink || courseLink.universityId !== page_params.uid) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      AND: [
        {
          universities: {
            has: courseLink.university.name
          }
        },
        {
          courses: {
            has: courseLink.course.name
          }
        }
      ]
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-4xl font-bold my-8">{courseLink.name}</h1>
      <h2 className="text-2xl text-muted-foreground mb-8">
        <Link href={`/ucas/schools/${courseLink.university.id}`} className="hover:underline">
          {courseLink.university.name}
        </Link>
        {' - '}
        <Link href={`/ucas/courses/${courseLink.course.id}`} className="hover:underline">
          {courseLink.course.name}
        </Link>
      </h2>

      <Card className="my-8">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">About</h3>
            <p className="prose dark:prose-invert max-w-none">
              {courseLink.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Entry Requirements</h3>
            <p className="prose dark:prose-invert max-w-none">
              {courseLink.entry_requirements}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge variant="secondary">UCAS Code: {courseLink.ucascode}</Badge>
            <Badge variant="secondary">Duration: {courseLink.duration} years</Badge>
            <Badge variant="secondary">Qualification: {courseLink.qualification}</Badge>
          </div>
        </CardContent>
      </Card>


      <h2 className="text-3xl font-bold my-8">Relevant Posts</h2>
      <UCASPostList posts={posts} />
    </div>
  );
} 