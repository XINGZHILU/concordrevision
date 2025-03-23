import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import {PDFViewer} from "@/lib/customui/Basic/pdf_frame";

export default async function Page(req : any, res : any){
    const params = await req.params;
    const fileid = params.file;

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

    return (<div className={'place-items-center'}>
        <PDFViewer
            pdfUrl={file.path}
            title={file.filename}
        />
    </div>)

}