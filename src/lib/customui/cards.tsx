import Link from "next/link";
import Image from "next/image";
import {assets} from "@/lib/assets";
import React from "react";
import { Badge } from "@chakra-ui/react";

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
        <a href={`/revision/${note.subjectId}/resources/${note.id}`}>
            <div
                className={`max-w-sm p-6 bg-white border-gray-200 border-2 rounded-lg shadow-sm`}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h5>
                <BadgeSymbol colour={colour}/>
            </div>
        </a>

    );
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
                className='w-[360px] h-[120px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
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

export function BadgeSymbol({colour}: { colour: number }) {
    if (colour === 0) {
        return (
            <Badge colorPalette="green">Green</Badge>
        );
    }
    else if (colour === 1) {
        return (
            <Badge colorPalette="yellow">Amber</Badge>
        );
    }
    else if (colour === 2) {
        return (
            <Badge colorPalette="red">Red</Badge>
        );
    }
    else {
        return (
            <Badge>Unclassified</Badge>
        );
    }
}
