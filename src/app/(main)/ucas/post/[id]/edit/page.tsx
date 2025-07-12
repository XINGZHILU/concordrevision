import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { EditUCASPostForm } from './edit-ucas-post-form';

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const user = await currentUser();

    if (!user) {
        notFound();
    }

    const post = await prisma.uCASPost.findUnique({
        where: { id: parseInt(params.id, 10) }
    });

    if (!post) {
        notFound();
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (user.id !== post.authorId && !dbUser?.admin) {
        notFound();
    }
    
    const tags = await prisma.tag.findMany();
    const universities = await prisma.university.findMany();
    const courses = await prisma.course.findMany();

    return (
        <div className="w-11/12 mx-auto">
            <h1 className="text-4xl font-bold my-8">Edit Post</h1>
            <EditUCASPostForm 
                post={post}
                tags={tags}
                universities={universities}
                courses={courses}
            />
        </div>
    );
}
