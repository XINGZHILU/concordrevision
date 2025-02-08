import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {year_group_names} from "@/lib/consts";
import {NoteCard} from "@/lib/customui/cards";
import {currentUser} from "@clerk/nextjs/server";
import {
    BreadcrumbCurrentLink,
    BreadcrumbLink,
    BreadcrumbRoot,
} from "@/components/ui/breadcrumb"
import {Collapsible, Tabs, Separator} from "@chakra-ui/react"
import {LuFolder, LuBookCheck} from "react-icons/lu"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req: any, res: any) {
    function Get_Colour(usr: { red: number[]; amber: number[]; green: number[] }, nid: number) {
        if (usr.red.includes(nid)) {
            return 2;
        } else if (usr.amber.includes(nid)) {
            return 1;
        } else if (usr.green.includes(nid)) {
            return 0;
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

    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!record) {
        return <h1>User not found</h1>;
    }

    const resource_list = subject.notes.map((note) => (
        <div key={note.id + 'div'}>
            <NoteCard note={note} key={note.id} colour={Get_Colour(record, note.id)}/>
            <br key={note.id + 'br'}/>
        </div>
    ));

    return (<div>
        <BreadcrumbRoot>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbLink href="/revision">Revision Notes</BreadcrumbLink>
            <BreadcrumbCurrentLink>{year_group_names[subject.level]} {subject.title}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>
        <br/>
        <h1>{year_group_names[subject.level]} {subject.title}</h1>
        <br/>

        <Collapsible.Root defaultOpen>
            <Collapsible.Trigger paddingY="3"><h2>About</h2></Collapsible.Trigger>
            <Collapsible.Content>
                {subject.desc.split('\n').map((line, index) => <p key={index}>{line}</p>)}
            </Collapsible.Content>
        </Collapsible.Root>
        <br/>
        <Tabs.Root defaultValue="resources" variant='plain'>
            <Tabs.List bg="bg.muted" rounded="l3" p="1">
                <Tabs.Trigger value="resources" p="2">
                    <LuFolder/>
                    Resources
                </Tabs.Trigger>
                <Tabs.Trigger value="tests" p="2">
                    <LuBookCheck/>
                    Upcoming tests
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content value="resources">
                {resource_list}
            </Tabs.Content>
            <Tabs.Content value="tests">...</Tabs.Content>
        </Tabs.Root>

    </div>)

}