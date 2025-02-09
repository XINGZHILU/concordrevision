'use client';


export default function PDFFrame({url}: { url: string }) {
    return <div className="w-full place-items-center h-screen">
        <div className="pdf h-screen w-full" >
            <object data={`${url}#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitW`}
                    type="application/pdf" className={"w-full h-screen"}>
                <p>You do not seem to have a functional PDF plug-in for this browser.</p>
            </object>
        </div>
    </div>;
}