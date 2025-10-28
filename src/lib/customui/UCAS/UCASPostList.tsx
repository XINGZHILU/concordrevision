import { Card, CardHeader, CardTitle, CardDescription } from '@/lib/components/ui/card';
import Link from "next/link";

export function UCASPostList({ posts }: {
  posts: {
    id: number;
    title: string;
    author: {
      firstname: string | null;
      lastname: string | null;
    };
  }[]
}) {

  if (posts.length === 0) {
    return <p className="text-muted-foreground mt-4">No posts found.</p>
  }

  return (
    <div className="space-y-4 mt-6">
      {posts.map(post => (
        <Link href={`/ucas/posts/${post.id}`} key={post.id} className="block">
          <Card className="hover:border-primary transition-colors duration-200">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                By {post.author.firstname} {post.author.lastname}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
} 