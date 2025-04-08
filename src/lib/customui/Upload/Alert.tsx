import { Alert } from "@chakra-ui/react";

export function MaxSizeAlert() {
    return <Alert.Root status="warning" >
        <Alert.Indicator />
        <Alert.Title>
            Uploaded files must be less than <b>2GB</b> in size.
        </Alert.Title>
    </Alert.Root>;
}

export function UploadInfo() {
    return <Alert.Root status="info" title="Upload guidelines">
        <Alert.Indicator />
        <Alert.Title>Upload guidelines</Alert.Title>
        <Alert.Description>
            <p>Uploaded files must be less than <b>2GB</b> in size.</p>
            <p>Click <a href={'https://www.markdownguide.org/basic-syntax/'} target="_blank"
                rel="noopener noreferrer"><b>here</b></a> for how to format your post</p>
        </Alert.Description>
    </Alert.Root>;
}