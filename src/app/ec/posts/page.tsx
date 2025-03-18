import {prisma} from "@/lib/prisma";
import MDViewer from "@/lib/customui/Basic/showMD";

export default async function Page() {
    const posts = await prisma.post.findMany();
    const post = posts[0];
    const content = post.content || "# Nothing";

    return <div>
        <MDViewer content={content}/>
    </div>;
}