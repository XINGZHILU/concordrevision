import Link from "next/link";
import Image from "next/image";
import {assets} from "@/lib/assets";
import React from "react";

function borderColour(colour: number) {
    if (colour === 0) {
        return 'border-green-400';
    }
    else if (colour === 1) {
        return 'border-amber-400';
    }
    else if (colour === 2) {
        return 'border-red-400';
    }
    else {
        return 'border-gray-400';
    }
}

export function NoteCard({note, colour}: {
    note: {
        id: number,
        title: string,
        desc: string,
        subjectId: number,
    },
    colour: number
}) {
    // https://flowbite.com/docs/components/card/
    return (
        <div
            className={`max-w-sm p-6 bg-white ${borderColour(colour)} border-2 rounded-lg shadow-sm`}>
            <a href="#">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h5>
            </a>
            <a href={`/revision/${note.subjectId}/resources/${note.id}`}
               className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Details
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
    );
}

export function ColourSymbol({colour}: { colour: number }) {
    if (colour === 0) {
        return (
            <div className={'py-2 px-1'}><span
                className={`focus:outline-none text-white bg-green-400 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}>Green</span></div>
        );
    }
    else if (colour === 1) {
        return (
            <div className={'py-2 px-1'}><span
                className={`focus:outline-none text-white bg-amber-400 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800`}>Amber</span></div>
        );
    }
    else if (colour === 2) {
        return (
            <div className={'py-2 px-1'}><span
                className={`focus:outline-none text-white bg-red-400 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800`}>Red</span></div>
        );
    }
    else {
        return (
            <div className={'py-2 px-1'}><span
                className={`focus:outline-none text-white bg-gray-400 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`}>Unclassified</span></div>
        );
    }
}

export function OlympiadCard({olympiad}: {
    olympiad: {
        id: number,
        title: string,
        desc: string,
        area: string
    }
}){
    return (
        <div className={'p-4'}>
            <div
                className='w-[330px] sm:w-[300px] h-[120px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
                <div className='p-5'>
                    <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{olympiad.title}</h5>
                    <Link href={`/olympiads/${olympiad.id}`} className='inline-flex items-center py-2 font-semibold text-center'>
                        View <Image src={assets.arrow} className='ml-2' alt='Arrow' width={12} height={12}/>
                    </Link>
                </div>
            </div>
        </div>
    );
}