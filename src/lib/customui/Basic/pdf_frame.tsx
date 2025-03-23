export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <iframe src={url} style={
        {
            width: "100%",
            height: "100%"
        }
    }></iframe>;
}
