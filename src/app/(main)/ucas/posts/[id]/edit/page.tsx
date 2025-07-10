
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditUCASPostForm from "./edit-ucas-post-form";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }
    
    const post = await prisma.uCASPost.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!post) {
        notFound();
    }

    if (post.authorId !== user.id) {
        return <div className="text-red-500">You are not authorized to edit this post.</div>
    }
    
    return <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <EditUCASPostForm post={post} />
    </div>;
}