// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {prisma} from "@/lib/prisma";
import MDViewer from "@/lib/customui/Basic/showMD";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";

export default async function Page(req: any, res: any) {
    const params = await req.params;
    const pid = params.pid as string;

    if (!isNumeric(pid)) {
        notFound();
    }

    const post = await prisma.post.findUnique({
        where: {id: +pid}
    });

    if (!post) {
        notFound();
    }

    return <div>
        <h1>{post.title}</h1> <br/>
        <MDViewer content={`${post.content}`}/>
    </div>;
}