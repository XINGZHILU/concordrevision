import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';

export default async function UniversityPage({ params }: { params: { uid: string } }) {
  const university = await prisma.university.findUnique({
    where: {
      id: params.uid
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
      <div className="prose dark:prose-invert max-w-none">
        {/* We can add more university details here in the future */}
      </div>

      <h2 className="text-3xl font-bold my-8">Relevant Posts</h2>
      <UCASPostList posts={posts} />
    </div>
  );
}