export default function PdfViewer({ url, title }: {
    url: string;
    title: string;
}) {
    //url = url.replace(/ /g, '%20');
    return <div className={'min-h-screen h-full w-full'}>
        <h1>{title}</h1>
        <iframe src={url} className={'w-full h-800'}></iframe>
    </div>;
}
