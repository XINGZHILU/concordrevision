import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {isNumeric} from "@/lib/utils";
import PDFViewer from "@/lib/customui/Basic/pdf_frame";

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
        <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
        }

        .main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .upload-section {
          margin-bottom: 2rem;
          text-align: center;
        }

        .viewer-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
        }
      `}</style>
    </div>)

}