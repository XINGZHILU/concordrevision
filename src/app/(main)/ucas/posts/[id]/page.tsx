import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import MDViewer from '@/lib/customui/Basic/showMD';
import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import { PinButton } from '@/app/(main)/ucas/posts/[id]/PinButton';
import FileList from "@/lib/customui/Basic/filelist";

export default async function PostPage({ params }: { params: { id: string } }) {
  const user = await currentUser();

  const post = await prisma.uCASPost.findUnique({
    where: {
      id: parseInt(params.id, 10)
    },
    include: {
      author: true,
      files: true
    }
  });

  if (!post) {
    notFound();
  }

  const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

  // If post is not approved, only allow access to author or admin
  if (!post.approved) {
    if (!user || (post.authorId !== user.id && !dbUser?.admin)) {
      notFound();
    }
  }

  const canEdit = user && (user.id === post.authorId || (dbUser && dbUser.admin));
  const isAdmin = dbUser?.admin ?? false;

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
            {isAdmin && (
              <PinButton postId={post.id} initialPinned={post.pinned} />
            )}
          </div>
        </div>
        <p className="text-muted-foreground">By {post.author.firstname} {post.author.lastname}</p>
        <div className="my-8">
          <MDViewer content={post.content} />
        </div>
      </div>
      <aside className="md:col-span-1 md:border-l md:pl-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Tags</h2>
            {
              post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              ) : (<p className="text-muted-foreground">No tags added</p>)
            }

          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Related Universities</h2>
            {
              post.universities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.universities.map(uni => (
                    <Badge key={uni}>{uni}</Badge>
                  ))}
                </div>
              ) : (<p className="text-muted-foreground">No universities tagged</p>)
            }
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Related Courses</h2>
            {
              post.courses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.courses.map(course => (
                    <Badge key={course}>{course}</Badge>
                  ))}
                </div>
              ) : (<p className="text-muted-foreground">No courses tagged</p>)
            }
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Attachments</h2>
            {
              post.files.length > 0 ? (
                <FileList files={post.files} />
              ) : (<p className="text-muted-foreground">No files attached</p>)
            }
          </div>
        </div>
      </aside>
    </div>
  );
} 