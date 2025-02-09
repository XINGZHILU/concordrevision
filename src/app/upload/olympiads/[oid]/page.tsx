import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import OlympiadUploadForm from "@/lib/customui/OlympiadUploadForm";
import {currentUser} from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req : any, res : any){
    const params = await req.params;
    const oid = params.oid;

    const olympiad = await prisma.olympiad.findUnique({
        where: {
            id: +oid
        },
        include: {
            resources: true
        }
    });

    if (!olympiad){
        notFound();
    }

    const user = await currentUser();
    if (!user){
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        };
    }

    return <div>
        <h1>{olympiad.title} upload</h1>
        <br/>
        <OlympiadUploadForm olympiad={olympiad.id} author={user.id}/>
    </div>;
}