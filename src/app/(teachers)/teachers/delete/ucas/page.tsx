import { prisma } from "@/lib/prisma";
import { TeacherUCASPostList } from "../ucas-post-list";
import { UCASPost } from "@prisma/client";

export default async function TeacherDeleteUCASPage() {
    const posts = await prisma.uCASPost.findMany({
        include: {
            author: true,
        },
    });

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Delete UCAS Posts</h1>
            <p className="text-muted-foreground mb-8">
                View and delete UCAS posts.
            </p>
            <TeacherUCASPostList posts={posts as (UCASPost & { author: { id: string, firstname: string | null, lastname: string | null } })[]} />
        </div>
    );
}

