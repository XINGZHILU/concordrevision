import { Alert } from "@chakra-ui/react"
import {currentUser} from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function RootLayout({children}: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) {
        notFound();
    }
    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });
    if (!record) {
        notFound();
    }
    if (!record.teacher && !record.upload_permission){
        notFound();
    }
    return (
        <div>
            <div className={'min-h-screen'}>
                {children}
            </div>
            <Alert.Root status="warning">
                <Alert.Indicator />
                <Alert.Title>
                    Uploaded files must be less than <b>5GB</b> in size.
                </Alert.Title>
            </Alert.Root>
        </div>
    );
}