export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <div className={'min-h-screen'}>
        <h1>{title}</h1>
        <iframe src={url} style={
            {
                width: "100%",
                height: "500%"
            }
        }></iframe>
    </div>;
}
