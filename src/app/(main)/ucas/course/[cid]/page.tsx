import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import Link from 'next/link';

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

  const universities = course.courseLinks.map(link => link.university);

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-4xl font-bold my-8">{course.name}</h1>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Offered at</h2>
        <div className="flex flex-wrap gap-4">
          {universities.map(uni => (
            <Link key={uni.id} href={`/ucas/school/${uni.id}`} className="bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg">
              {uni.name}
            </Link>
          ))}
        </div>
      </div>

      <h2 className="text-3xl font-bold my-8">Relevant Posts</h2>
      <UCASPostList posts={posts} />
    </div>
  );
} 