import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import { PostList } from '@/app/(main)/ucas/posts/post-list';

export default async function PostsPage() {
  const posts = await prisma.uCASPost.findMany({
    where: {
      approved: true
    },
    orderBy: [
      {
        pinned: 'desc'
      },
      {
        uploadedAt: 'desc'
      }
    ],
    include: {
      author: true
    },
  });

  const tags = await prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  const universities = await prisma.university.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  const ucasSubjects = await prisma.uCASSubject.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className='w-11/12 mx-auto'>
      <h1 className="text-4xl font-bold my-8">UCAS Posts</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <PostList
          posts={posts}
          tags={tags}
          universities={universities}
          ucasSubjects={ucasSubjects}
        />
      </Suspense>
    </div>
  )
} 