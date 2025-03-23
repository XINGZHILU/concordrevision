export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <div className={'min-h-screen h-full w-full'}>
        <iframe src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`} style={
            {
                width: '100%',
                height: '80%',
                border: 'none'
            }
        } title={title}></iframe>
    </div>;
}
