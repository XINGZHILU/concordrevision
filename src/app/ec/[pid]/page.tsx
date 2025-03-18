// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {prisma} from "@/lib/prisma";
import MDViewer from "@/lib/customui/Basic/showMD";
import {notFound} from "next/navigation";


export default async function Page(req: any, res: any) {
    const params = await req.params;
    const pid = params.pid;

    const post = await prisma.post.findUnique({
        where: {id: pid}
    });

    if (!post) {
        notFound();
    }

    return <div>
        <h1>{post.title}</h1>
        <MDViewer content={post.content}/>
    </div>;
}