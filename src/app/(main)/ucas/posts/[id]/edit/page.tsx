import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { EditUCASPostForm } from '@/app/(main)/ucas/posts/[id]/edit/edit-ucas-post-form';

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const user = await currentUser();

    if (!user) {
        notFound();
    }

    const post = await prisma.uCASPost.findUnique({
        where: { id: parseInt((await params).id, 10) },
        include: {
            files: true
        }
    });

    if (!post) {
        notFound();
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    // Allow authors, admins, and teachers to edit posts
    if (user.id !== post.authorId && !dbUser?.admin && !dbUser?.teacher) {
        notFound();
    }
    
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
        <div className="w-11/12 mx-auto">
            <h1 className="text-4xl font-bold my-8">Edit Post</h1>
            <EditUCASPostForm 
                post={post}
                tags={tags}
                universities={universities}
                ucasSubjects={ucasSubjects}
            />
        </div>
    );
}
