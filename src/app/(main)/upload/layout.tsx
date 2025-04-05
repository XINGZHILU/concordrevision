import { Alert } from "@chakra-ui/react"
import {currentUser} from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";

export default async function RootLayout({children}: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) {
        return <h1>You must login to access this page</h1>;
    }
    const record = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });
    if (!record) {
        return <h1>User not found</h1>;
    }
    if (!record.teacher && !record.upload_permission){
        return <h1>You do not have permission to access this page</h1>;
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