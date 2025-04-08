import { Alert } from "@chakra-ui/react";

export function MaxSizeAlert(){
    return <Alert.Root status="warning">
    <Alert.Indicator />
    <Alert.Title>
        Uploaded files must be less than <b>2GB</b> in size.
    </Alert.Title>
</Alert.Root>;
}