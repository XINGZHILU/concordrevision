import { Alert } from "@chakra-ui/react"

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <div>
            <Alert.Root status="warning">
                <Alert.Indicator />
                <Alert.Title>
                    Uploaded files must be less than <b>5GB</b> in size.
                </Alert.Title>
            </Alert.Root>
            {children}
        </div>
    );
}