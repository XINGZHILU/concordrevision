import { Badge } from "@chakra-ui/react"

export function SatTestBadge() {
    return <Badge variant='solid' colorPalette='green'>Saturday Test</Badge>;
}

export function EOTBadge() {
    return <Badge variant='solid' colorPalette='orange'>End of term exam</Badge>;
}

export function PublicExamBadge() {
    return <Badge variant='solid' colorPalette='red'>Public exam</Badge>;
}

export function TestBadge({ type }: { type: number }) {
    if (type === 0) {
        return <SatTestBadge />
    }
    else if (type === 1) {
        return <EOTBadge />
    }
    else {
        return <PublicExamBadge />
    }
}