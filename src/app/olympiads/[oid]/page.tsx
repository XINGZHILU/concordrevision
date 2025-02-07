import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";

export default async function Page(req : any, res : any){
    const params = await req.params;
    const oid = params.oid;

    const olympiad = await prisma.olympiad.findUnique({
        where: {
            id: +oid
        }
    });

    if (!olympiad){
        notFound();
    }

    return <div className={'content-center'}>
        <h1>{olympiad.title}</h1>
        <p>{olympiad.desc}</p>
        <h2>Resources</h2>
    </div>
}