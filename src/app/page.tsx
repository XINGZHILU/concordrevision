import {prisma} from "@/lib/prisma";
import Header from "@/lib/ui/Header";
import Pomodoro from "@/lib/ui/pomodoro";

export default async function Home() {
    const subjects = await prisma.subject.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    return (
        <>
            <Header/>
            <Pomodoro/>
        </>
    )
}
