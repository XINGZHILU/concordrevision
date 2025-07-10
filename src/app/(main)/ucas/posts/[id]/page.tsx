import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ShowMarkdown from "@/lib/customui/Basic/showMD";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default async function UcasPostPage({ params }: { params: { id: string } }) {
    const user = await currentUser();
    const postId = parseInt(params.id, 10);

    if (isNaN(postId)) {
        notFound();
    }

    const post = await prisma.uCASPost.findUnique({
        where: { id: postId },
        include: {
            author: {
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                }
            },
            files: true,
        },
    });

    if (!post || (!post.approved && user?.id !== post.authorId)) {
        notFound();
    }

    return (
        <div className="w-11/12 md:w-3/4 lg:w-2/3 mx-auto mt-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-4xl font-bold">{post.title}</h1>
                 {user?.id === post.author.id && (
                    <Link href={`/ucas/posts/${post.id}/edit`}>
                        <Button variant="outline">
                            <Pencil1Icon className="mr-2 h-4 w-4" />
                            Edit Post
                        </Button>
                    </Link>
                )}
            </div>
            <p className="text-muted-foreground mb-8">
                Posted by {post.author.firstname} {post.author.lastname}
            </p>

            <div className="prose dark:prose-invert max-w-none">
                 <ShowMarkdown content={post.content} />
            </div>

            {post.files.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Attached Files</h3>
                    <ul className="space-y-2">
                        {post.files.map(file => (
                            <li key={file.id}>
                                <a
                                    href={file.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {file.filename}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
} 