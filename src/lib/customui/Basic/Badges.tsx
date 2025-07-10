import { Badge } from "../../../components/ui/badge";

export function SatTestBadge() {
    return <Badge variant='default'>Saturday Test</Badge>;
}

export function EOTBadge() {
    return <Badge variant='secondary'>End of term exam</Badge>;
}

export function PublicExamBadge() {
    return <Badge variant='destructive'>Public exam</Badge>;
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