'use client';

export default function PDFFrame({url}: { url: string }) {
    return <div className="w-full place-items-center">
        <iframe itemType={'pdf'} id={'pdf_frame'} src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`} width="100%" height="90%" allowFullScreen={true}/>
    </div>;
}