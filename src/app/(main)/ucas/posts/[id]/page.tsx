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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 border-b pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {post.title}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              By {post.author.firstname} {post.author.lastname}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
      </div>

      {/* Two-column layout with conditional sidebar based on attachments */}
      {post.files.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content - larger proportion */}
          <div className="flex-grow md:w-3/4">
            <div className="bg-card rounded-lg shadow-md border border-border p-8 mb-6">
              <div className="prose prose-lg max-w-none text-foreground">
                <MDViewer content={post.content} />
              </div>
            </div>
          </div>

          {/* Sidebar - includes attachments and related metadata */}
          <div className="md:w-1/4">
            <div className="bg-card rounded-lg shadow-sm border p-4 md:p-6 sticky top-20">
              <PostSidebar
                tags={post.tags}
                universities={universities}
                ucasSubjects={ucasSubjects}
                files={post.files}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Full width content when no attachments */}
          <div className="w-full">
            <div className="bg-card rounded-lg shadow-md border border-border p-8 mb-6">
              <div className="prose prose-lg max-w-none text-foreground">
                <MDViewer content={post.content} />
              </div>
            </div>
          </div>

          {/* Metadata section below main content when there are no attachments */}
          <div className="mt-6">
            <PostSidebar
              tags={post.tags}
              universities={universities}
              ucasSubjects={ucasSubjects}
              files={post.files}
            />
          </div>
        </>
      )}
    </div>
  );
} 