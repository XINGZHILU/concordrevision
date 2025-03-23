export default function PdfViewer({ url, title } : {
    url: string;
    title: string;
}) {
    return <div className="w-full h-full flex flex-col">
        <h1>{title}</h1>
        <object
            data={url}
            type="application/pdf"
            className="w-full h-full"
        >
            <div className="p-4 text-center">
                <p>Your device cannot display this PDF inside the app.</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Open PDF
                </a>
            </div>
        </object>
    </div>;
}
