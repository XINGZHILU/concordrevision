/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OlympiadResourceCard } from "@/lib/customui/Basic/cards";
import MDViewer from "@/lib/customui/Basic/showMD";
import { Collapsible } from "@chakra-ui/react"

// eslint-disable-next-line @typescript-eslint/no-unused-vars 
export default async function Page(req: any, res: any) {
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

    if (!olympiad) {
        notFound();
    }

    const resources = olympiad.resources.filter((resource) => { return resource.approved });

    return <div>
        <h1>{olympiad.title}</h1>
        <br />
        <Collapsible.Root defaultOpen>
            <Collapsible.Trigger paddingY="3"><h2>About</h2></Collapsible.Trigger>
            <Collapsible.Content>
                <MDViewer content={olympiad.desc}/>
            </Collapsible.Content>
        </Collapsible.Root>
        <br />
        <h2>External Links</h2>
        <div>
            {
                olympiad.links.length === 0 ? (
                    <p>No external links available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Content
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Link
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {olympiad.links.map((link, index) => {
                                    const description = olympiad.link_descriptions && olympiad.link_descriptions[index]
                                        ? olympiad.link_descriptions[index]
                                        : 'No description available';
                                    return (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{description}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {link}
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
        <br />
        <h2>Resources</h2>
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-h-screen overflow-y-scroll'}>
            {
                resources.length === 0 ? (
                    <p>No resources</p>
                ) : (
                    resources.map((resource) => {
                        return <OlympiadResourceCard key={resource.id} resource={resource} />
                    })
                )
            }
        </div>
    </div>;
}