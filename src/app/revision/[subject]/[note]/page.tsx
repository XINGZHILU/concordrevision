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

    return (<div className="w-full">
        <h1>{year_group_names[subject.level]} {subject.title} - {note.title}</h1>
        <br/>
        <p>{note.desc}</p>
        <br/>
        <div className="w-full place-items-center">
            <iframe src={note.filename} width={'90%'} height={600}></iframe>
        </div>
    </div>)
}