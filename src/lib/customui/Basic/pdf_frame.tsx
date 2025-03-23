export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <div className={'min-h-screen'}>
        <iframe src={url} style={
            {
                width: "100%",
                height: "100%"
            }
        }></iframe>
    </div>;
}
