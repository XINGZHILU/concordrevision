import PostForm from "@/lib/customui/EC/new_post";
import {currentUser} from "@clerk/nextjs/server";


export default async function Page() {

    const user = await currentUser();
    if (!user) {
        return <h1>You must login to access this page</h1>;
    }

    return <div>
        <PostForm author={user.id}/>
    </div>;
}