import { UCASUploadForm } from "@/lib/customui/Upload/UCASUploadForm";
import { prisma } from "@/lib/prisma";

export default async function UcasUploadPage() {

    const universities = await prisma.university.findMany({
        select: {
            id: true,
            name: true,
            courses: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold">Upload UCAS Post</h1>
            <p className="text-muted-foreground">Share your advice and experiences about university applications.</p>
            <div className="mt-6">
                <UCASUploadForm universities={universities} />
            </div>
        </div>
    )
} 