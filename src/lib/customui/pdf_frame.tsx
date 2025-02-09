'use client';

import {Button} from "@chakra-ui/react";

export default function PDFFrame({url}: { url: string }) {
    function fullScreen() {
        if (document.getElementById('pdf_frame') !== null) {
            // @ts-expect-error
            document.getElementById('pdf_frame').requestFullscreen();
        }
    }
    return <div className="w-full place-items-center">
        <iframe itemType={'pdf'} id={'pdf_frame'} src={url} className={'w-11/12 h-screen'} allowFullScreen={true}></iframe>
        <Button onClick={fullScreen} variant={'solid'}>Full Screen</Button>
    </div>;
}