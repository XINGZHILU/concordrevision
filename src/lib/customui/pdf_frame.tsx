'use client';

export default function PDFFrame({url}: { url: string }) {
    return <div className="w-full place-items-center">
        <iframe itemType={'pdf'} id={'pdf_frame'} src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`} className={'w-11/12 h-screen'} allowFullScreen={true}/>
    </div>;
}