import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {OlympiadResourceCard} from "@/lib/customui/Basic/cards";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page(req : any, res : any){
    const params = await req.params;
    const oid = params.oid;

    const olympiad = await prisma.olympiad.findUnique({
        where: {
            id: +oid
        },
        include: {
            resources: true,
        }
    });

    if (!olympiad){
        notFound();
    }

    const resources = olympiad.resources.filter((resource) => {return resource.approved});

    return <div>
        <h1>{olympiad.title}</h1>
        <br/>
        <h2>About</h2>
        <p>{olympiad.desc}</p>
        <br/>
        <h2>External Links</h2>
        <div>
            {
                olympiad.links.length === 0 ? (
                    <p>No external links available</p>
                ) : (
                    <ul className="space-y-2 list-disc pl-5">
                        {olympiad.links.map((link, index) => {
                            const description = olympiad.link_descriptions && olympiad.link_descriptions[index] 
                                ? ` - ${olympiad.link_descriptions[index]}` 
                                : '';
                            return (
                                <li key={index}>
                                    <a href={link} target={'_blank'} rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {link}{description}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                )
            }
        </div>
        <br/>
        <h2>Resources</h2>
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-h-screen overflow-y-scroll'}>
            {
                resources.length === 0 ? (
                    <p>No resources</p>
                ) : (
                    resources.map((resource) => {
                        return <OlympiadResourceCard key={resource.id} resource={resource}/>
                    })
                )
            }
        </div>
    </div>;
}