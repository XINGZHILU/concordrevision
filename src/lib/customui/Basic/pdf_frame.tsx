export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    //url = url.replace(/ /g, '%20');
    return <div className={'min-h-screen h-full w-full'}>
        <iframe src={url} style={
            {
                width: '100%',
                height: '80%',
            }
        }></iframe>
    </div>;
}
