import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDViewer from '@/lib/customui/Basic/showMD';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from "@/lib/components/ui/button";
import { PinButton } from '@/app/(main)/ucas/posts/[id]/PinButton';
import { PostSidebar } from './PostSidebar';

export default async function PostPage({ params }: { params: { id: string } }) {
  const user = await currentUser();

  const post = await prisma.uCASPost.findUnique({
    where: {
      id: parseInt((await params).id, 10)
    },
    include: {
      author: true,
      files: true
    }
  });

  if (!post) {
    notFound();
  }

  // Fetch university and UCAS subject names from their IDs
  const universities = await prisma.university.findMany({
    where: {
      id: {
        in: post.universities
      }
    },
    select: {
      id: true,
      name: true
    }
  });

  const ucasSubjects = await prisma.uCASSubject.findMany({
    where: {
      id: {
        in: post.ucasSubjects
      }
    },
    select: {
      id: true,
      name: true
    }
  });

  const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

  // If post is not approved, only allow access to author, admin, or teacher
  if (!post.approved) {
    if (!user || (post.authorId !== user.id && !dbUser?.admin && !dbUser?.teacher)) {
      notFound();
    }
  }

  // Allow authors, admins, and teachers to edit posts
  const canEdit = user && (user.id === post.authorId || (dbUser && (dbUser.admin || dbUser.teacher)));
  const isAdmin = dbUser?.admin ?? false;
  const isTeacher = dbUser?.teacher ?? false;
  // Allow both admins and teachers to pin posts
  const canPin = isAdmin || isTeacher;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-11/12 mx-auto">
      <div className="md:col-span-3">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className='flex gap-2'>
            {canEdit && (
              <Button asChild>
                <Link href={`/ucas/posts/${post.id}/edit`}>Edit Post</Link>
              </Button>
            )}
            {canPin && (
              <PinButton postId={post.id} initialPinned={post.pinned} />
            )}
          </div>
        </div>
        <p className="text-muted-foreground">By {post.author.firstname} {post.author.lastname}</p>
        <div className="my-8">
          <MDViewer content={post.content} />
        </div>
      </div>
      <PostSidebar 
        tags={post.tags}
        universities={universities}
        ucasSubjects={ucasSubjects}
        files={post.files}
      />
    </div>
  );
} 