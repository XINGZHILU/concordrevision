'use client';

//import {Suspense} from "react";

export default function PDFFrame({url}: { url: string }) {
    return <div>
        <iframe itemType={'application/pdf'} id={'pdf_frame'}
                src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`}
                className={'w-11/12 h-screen'} allowFullScreen={true}/>
    </div>;
}