import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {NoteCard} from "@/lib/ui/cards";
import {currentUser} from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req: any, res: any) {
    function Get_Colour(note: { greenUIDs: string[]; amberUIDs: string[]; redUIDs: string[]; }, uid: string) {
        if (note.greenUIDs.includes(uid)) {
            return 0;
        } else if (note.amberUIDs.includes(uid)) {
            return 1;
        } else if (note.redUIDs.includes(uid)) {
            return 2;
        } else {
            return -1;
        }
    }

    const params = await req.params;
    const sid = params.subject;

    if (!isNumeric(sid)) {
        notFound();
    }

    const subject = await prisma.subject.findUnique({
        where: {
            id: +sid
        },
        include: {
            notes: true,
            tests: true
        }
    });

    if (!subject) {
        notFound();
    }


    console.log(subject);

    const user = await currentUser();
    if (!user) {
        return <h1>You must login to access this page</h1>;
    }

    return (<div>
        <h1>{year_group_names[subject.level]} {subject.title}</h1>
        <br/>
        <h2>About</h2>
        <p>{subject.desc}</p>
        <br/>
        <h2>Resources</h2>
        {subject.notes.map((note) => (
            <div key={note.id+'div'}>
                <NoteCard note={note} key={note.id} colour={Get_Colour(note, user.id)}/>
                <br key={note.id+'br'}/>
            </div>
        ))}
        <h2>Upcoming tests</h2>
        {subject.tests.map((test) => (<h3 key={test.id}>{test.title}</h3>))}
    </div>)

}