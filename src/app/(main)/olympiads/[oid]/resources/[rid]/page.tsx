/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import FileList from "@/lib/customui/Basic/filelist";
import MDViewer from "@/lib/customui/Basic/showMD";
import Link from "next/link";
import { LuArrowLeft, LuFileText, LuFile, LuExternalLink } from "react-icons/lu";

export default async function Page(req : any, res : any){
    const params = await req.params;
    const oid = params.oid;
    const rid = params.rid;

    if (!isNumeric(oid) || !isNumeric(rid)) {
        notFound();
    }

    const olympiad = await prisma.olympiad.findUnique({
        where: {
            id: +oid
        }
    });

    if (!olympiad) {
        notFound();
    }

    const resource = await prisma.olympiad_Resource.findUnique({
        where: {
            id: +rid
        },
        include: {
            files: true,
            author: {
                select: {
                    firstname: true,
                    lastname: true
                }
            }
        }
    });

    if (!resource || !resource.approved) {
        notFound();
    }

    const resourceType = getResourceTypeLabel(resource.type);
    const authorName = resource.author.firstname && resource.author.lastname 
        ? `${resource.author.firstname} ${resource.author.lastname}`
        : "Anonymous";

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link 
                    href={`/olympiads/${olympiad.id}`}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    <LuArrowLeft className="mr-2" />
                    <span>Back to {olympiad.title}</span>
                </Link>
            </div>

            {/* Page Header */}
            <div className="mb-8 border-b pb-4">
                <div className="flex flex-wrap items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {resource.title}
                    </h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {resourceType}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{olympiad.title}</span>
                    <span>•</span>
                    <span>{olympiad.area}</span>
                    <span>•</span>
                    <span>Contributed by {authorName}</span>
                </div>
            </div>

            {/* Two-column layout */}
            {/* Conditional layout based on whether there are files */}
            {resource.files.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main content - larger proportion */}
                    <div className="flex-grow md:w-3/4">
                        <div className="bg-blue-50 rounded-lg shadow-md border border-blue-100 p-8 mb-6">
                            <h2 className="text-2xl font-semibold mb-5 text-blue-800 border-b pb-3 border-blue-200">Olympiad Resource Content</h2>
                            <div className="prose prose-lg max-w-none text-gray-800">
                                <MDViewer content={resource.desc}/>
                            </div>
                        </div>

                        {/* Related olympiad links if available */}
                        {olympiad.links && olympiad.links.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <LuExternalLink className="mr-2" />
                                    Related Links
                                </h2>
                                <ul className="space-y-2">
                                    {olympiad.links.map((link, index) => {
                                        const description = olympiad.link_descriptions && olympiad.link_descriptions[index]
                                            ? olympiad.link_descriptions[index]
                                            : link;
                                        return (
                                            <li key={index} className="flex">
                                                <a 
                                                    href={link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                                                >
                                                    <LuExternalLink className="mr-2 flex-shrink-0" />
                                                    <span>{description}</span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar for files - only shown when there are files */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <LuFileText className="mr-2" />
                                Attachments
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({resource.files.length})
                                </span>
                            </h2>
                            <FileList files={resource.files} />
                        </div>
                    </div>
                </div>
            ) : (
                /* Full width content when no files */
                <div className="w-full">
                    <div className="bg-blue-50 rounded-lg shadow-md border border-blue-100 p-8 mb-6">
                        <h2 className="text-2xl font-semibold mb-5 text-blue-800 border-b pb-3 border-blue-200">Olympiad Resource Content</h2>
                        <div className="prose prose-lg max-w-none text-gray-800">
                            <MDViewer content={resource.desc}/>
                        </div>
                    </div>

                    {/* Related olympiad links if available */}
                    {olympiad.links && olympiad.links.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <LuExternalLink className="mr-2" />
                                Related Links
                            </h2>
                            <ul className="space-y-2">
                                {olympiad.links.map((link, index) => {
                                    const description = olympiad.link_descriptions && olympiad.link_descriptions[index]
                                        ? olympiad.link_descriptions[index]
                                        : link;
                                    return (
                                        <li key={index} className="flex">
                                            <a 
                                                href={link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                                            >
                                                <LuExternalLink className="mr-2 flex-shrink-0" />
                                                <span>{description}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function getResourceTypeLabel(type: number): string {
    switch(type) {
        case 0: return "Past Paper";
        case 1: return "Solution";
        case 2: return "Other";
        default: return "Resource";
    }
}