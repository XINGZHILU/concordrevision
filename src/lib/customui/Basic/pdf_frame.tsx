export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <div id="__next">
        <h1>{title}</h1>
        <iframe src={url} style={
            {
                width: "100%",
                height: "100%"
            }
        }></iframe>
    </div>;
}
