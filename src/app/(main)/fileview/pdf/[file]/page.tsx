import PDFViewer from "@/lib/customui/Basic/PdfViewer";
import { prisma } from "@/lib/prisma";
import { isNumeric } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function Page({ params } : {params : {file : string}}) {
    const page_params = await params;
    const fileid = page_params.file;

    if (!isNumeric(fileid)) {
        notFound();
    }

    const file = await prisma.storageFile.findUnique({
        where: {
            id: +fileid
        }
    });

    if (!file) {
        notFound();
    }
    return (<PDFViewer
        url={file.path}
    />);
}