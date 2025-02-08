import {prisma} from "@/lib/prisma";
import OlympiadsList from "@/lib/customui/olympiadslist";
import {BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot} from "@/components/ui/breadcrumb";

export default async function Page(){
    const olympiads = await prisma.olympiad.findMany({
        orderBy: {
            title: 'asc'
        }
    });
    return <div className={'content-center'}>
        <BreadcrumbRoot>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbCurrentLink>Olympiads</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
        <br/>
        <h1>Olympiads</h1>
        <OlympiadsList olympiads={olympiads}/>
    </div>;
}