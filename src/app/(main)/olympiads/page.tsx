import { prisma } from "@/lib/prisma";
import OlympiadsList from "@/lib/customui/Olympiads/olympiadslist";

export default async function Page() {
    const olympiads = await prisma.olympiad.findMany({
        orderBy: {
            title: 'asc'
        }
    });
    return <div className={'content-center'}>
        <OlympiadsList olympiads={olympiads} />
    </div>;
}