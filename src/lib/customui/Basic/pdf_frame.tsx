export default function PdfViewer({ url, title } : {
    url: string;
    title: string;
}) {
    return <div>
        <h1>{title}</h1>
        <div className="w-full h-screen flex flex-col">
            <iframe src={url} className={'w-full h-screen'}></iframe>
        </div>
    </div>;
}
