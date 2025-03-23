export default function PdfViewer({url, title}: {
    url: string;
    title: string;
}) {
    return <div id="__next" className={'h-full'}>
        <h1>{title}</h1>
        <iframe src={url} style={
            {
                width: "100%",
                height: "100%",
                minHeight: "100%",
                flexGrow: 1,
                overflow: 'auto',

            }
        }></iframe>
    </div>;
}
