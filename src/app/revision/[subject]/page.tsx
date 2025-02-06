import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {NoteCard} from "@/lib/ui/cards";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req: any, res: any) {
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
            notes: true
        }
    });

    if (!subject) {
        notFound();
    }


    console.log(subject);

    return (<div>
        <h1>{year_group_names[subject.level]} {subject.title}</h1>
        <br/>
        <h2>About</h2>
        <p>{subject.desc}</p>
        <br/>
        <h2>Notes</h2>
        {subject.notes.map((note) => (
            <div key={note.id+'div'}>
                <NoteCard note={note} key={note.id}/>
                <br key={note.id+'br'}/>
            </div>
        ))}
    </div>)

}