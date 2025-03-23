export default function PdfViewer({ url, title } : {
    url: string;
    title: string;
}) {
    return <div>
        <h1>{title}</h1>
        <iframe src={url} className={'w-full h-screen'}></iframe>
    </div>;
}
