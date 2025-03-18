import {prisma} from "@/lib/prisma";
import {PostCard} from "@/lib/customui/EC/EC_card";
import Link from "next/link";

export default async function Page() {
    const posts = await prisma.post.findMany();

    return <div>
        <Link href={'/ec/new'}>New Post</Link>
        <h1>Current posts</h1>
        {
            posts.map((post) => {
                return <PostCard post={post} key={post.id}/>
            })
        }
    </div>;
}