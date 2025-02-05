import { prisma } from "@/lib/prisma";
import NoteList from "@/lib/ui/NoteList";

export default async function Home() {
    const subjects = await prisma.subject.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    return (
        <>
            <NoteList subjects={subjects} year = {0}/>
        </>
    )
}
