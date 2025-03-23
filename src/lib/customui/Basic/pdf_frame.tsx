export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <div className={'min-h-screen h-full w-full'}>
        <iframe src={url} style={
            {
                width: '100%',
                height: '60%',
                border: 'none'
            }
        } title={title}></iframe>
    </div>;
}
