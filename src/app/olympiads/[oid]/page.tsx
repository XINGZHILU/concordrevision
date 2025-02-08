import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot} from "@/components/ui/breadcrumb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


    return <div>
        <BreadcrumbRoot>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbLink href="/olympiads">Olympiads</BreadcrumbLink>
            <BreadcrumbCurrentLink>{olympiad.title}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
        <br/>
        <h1>{olympiad.title}</h1>
        <br/>
        <h2>About</h2>
        <p>{olympiad.desc}</p>
        <br/>
        <h2>Resources</h2>
    </div>
}