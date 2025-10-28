import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";

export default async function CoursePage({ params }: { params: { cid: string } }) {
  const course = await prisma.course.findUnique({
    where: {
      id: params.cid
    },
    include: {
      courseLinks: {
        include: {
          university: true
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      courses: { // Note the typo in the schema
        has: course.name
      }
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-4xl font-bold my-8">{course.name}</h1>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p>{course.description}</p>
        </div>
        <h2 className="text-3xl font-bold mb-4">Offered at</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.courseLinks.map(courseLink => (
            <Link
              href={`/ucas/schools/${courseLink.universityId}/${courseLink.id}`}
              key={courseLink.id}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{courseLink.university.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{courseLink.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold my-8">Relevant Posts</h2>
      <UCASPostList posts={posts} />
    </div>
  );
} 