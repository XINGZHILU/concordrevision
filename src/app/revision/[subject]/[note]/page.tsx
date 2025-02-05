import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";

export default async function Page(req : any, res : any){
    const params = await req.params;
    const sid = params.subject;
    const nid = params.note;

    if (!isNumeric(sid) || !isNumeric(nid)) {
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

    const note = subject.notes.filter((note) => note.id === +nid)[0];

    console.log(note);

    if (!note) {
        notFound();
    }

    return (<div>
        <h1>{year_group_names[subject.level]} {subject.title}</h1>
        <h2>{note.title}</h2>
        <embed src={note.filename} className='w-screen h-screen'></embed>
    </div>)
}