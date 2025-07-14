import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default async function UniversityPage({ params }: { params: { uid: string } }) {
  const university = await prisma.university.findUnique({
    where: {
      id: params.uid
    },
    include: {
      courseLinks: {
        include: {
          course: true
        }
      }
    }
  });

  if (!university) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      universities: {
        has: university.name
      }
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-4xl font-bold my-8">{university.name}</h1>
      <h2 className="text-3xl font-bold my-8">About</h2>
      <div className="prose dark:prose-invert max-w-none">
        <p>{university.description}</p>
      </div>

      <h2 className="text-3xl font-bold my-8">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {university.courseLinks.map(courseLink => (
          <Link
            href={`/ucas/schools/${university.id}/${courseLink.id}`}
            key={courseLink.id}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{courseLink.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {courseLink.course.name}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl font-bold my-8">Relevant Posts</h2>
      <UCASPostList posts={posts} />
    </div>
  );
}