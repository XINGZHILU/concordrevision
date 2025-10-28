import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/lib/components/ui/badge";
import FileList from "@/lib/customui/Basic/filelist";
import MDViewer from "@/lib/customui/Basic/showMD";
import UCASPostReviewActions from "./ucas-post-review-actions";

export default async function UCASPostReviewPage({ params }: { params: { id: string } }) {

    const postId = await params.id;

    if (!postId) {
        notFound();
    }

    const post = await prisma.uCASPost.findUnique({
        where: {
            id: parseInt(postId),
        },
        include: {
            author: {
                select: {
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            },
            files: true,
        },
    });

    if (!post) {
        notFound();
    }

    const tags = await prisma.tag.findMany();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link
                        href="/teachers/approval"
                        className="text-primary hover:text-primary/80 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Back to Approval Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">Review UCAS Post: {post.title}</h1>
                </div>

                <UCASPostReviewActions postId={post.id} />
            </div>

            <div className="bg-card shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">{post.title}</h2>
                            <p className="text-sm text-muted-foreground">
                                Submitted by: {`${post.author.firstname} ${post.author.lastname}` || 'Unknown'} ({post.author.email})
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Content:</h3>
                        <div className="bg-muted p-4 rounded border border-border">
                            {post.content ? (
                                <MDViewer content={post.content} />
                            ) : (
                                <p className="text-muted-foreground italic">No content provided</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tagId => {
                                const tag = tags.find(t => t.id === tagId);
                                return tag ? <Badge key={tag.id} variant="secondary">{tag.name}</Badge> : null;
                            })}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Universities:</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.universities.map(uni => <Badge key={uni} variant="outline">{uni}</Badge>)}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Courses:</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.courses.map(course => <Badge key={course} variant="outline">{course}</Badge>)}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Files ({post.files.length}):</h3>
                        {post.files.length > 0 ? (
                            <div className="bg-muted p-4 rounded border border-border">
                                <FileList files={post.files} />
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">No files attached</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 