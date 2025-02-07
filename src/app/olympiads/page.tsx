import {prisma} from "@/lib/prisma";
import OlympiadsList from "@/lib/ui/olympiadslist";

export default async function Page(){
    const olympiads = await prisma.olympiad.findMany();
    return <div className={'content-center'}>
        <h1>Olympiads</h1>
        <OlympiadsList olympiads={olympiads}/>
    </div>;
}