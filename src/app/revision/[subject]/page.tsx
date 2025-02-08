import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {NoteCard} from "@/lib/ui/cards";
import {currentUser} from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req: any, res: any) {
    function Get_Colour(usr: { red: number[]; amber: number[]; green: number[]}, nid: number) {
        if (usr.red.includes(nid)) {
            return 2;
        }
        else if (usr.amber.includes(nid)) {
            return 1;
        }
        else if (usr.green.includes(nid)) {
            return 0;
        }
        else {
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

    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!record){
        return <h1>User not found</h1>;
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
                <NoteCard note={note} key={note.id} colour={Get_Colour(record, note.id)}/>
                <br key={note.id+'br'}/>
            </div>
        ))}
        <h2>Upcoming tests</h2>
        {subject.tests.map((test) => (<h3 key={test.id}>{test.title}</h3>))}
    </div>)

}