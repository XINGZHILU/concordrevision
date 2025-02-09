import { Link as CL, Tabs } from "@chakra-ui/react"

export function SubjectTabs({ f3, f4, f5, f61, f62, defaultval }: {
    f3: React.JSX.Element[],
    f4: React.JSX.Element[],
    f5: React.JSX.Element[],
    f61: React.JSX.Element[],
    f62: React.JSX.Element[],
    defaultval: string
}) {
    const className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 max-w-9/10';
    return (<div className="w-screen">
        <Tabs.Root defaultValue={defaultval} variant='plain' rounded="l3">
            <Tabs.List p="1">
                <Tabs.Trigger value="f3" asChild p="2">
                    <CL unstyled href="#f3">
                        Form 3
                    </CL>
                </Tabs.Trigger>
                <Tabs.Trigger value="f4" asChild p="2">
                    <CL unstyled href="#f4">
                        Form 4
                    </CL>
                </Tabs.Trigger>
                <Tabs.Trigger value="f5" asChild p="2">
                    <CL unstyled href="#f5">
                        Form 5
                    </CL>
                </Tabs.Trigger>
                <Tabs.Trigger value="61" asChild p="2">
                    <CL unstyled href="#61">
                        6.1
                    </CL>
                </Tabs.Trigger>
                <Tabs.Trigger value="62" asChild p="2">
                    <CL unstyled href="#62">
                        6.2
                    </CL>
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content value="f3">
                <div className={className}>{f3}</div>
            </Tabs.Content>
            <Tabs.Content value="f4">
                <div className={className}>{f4}</div>
            </Tabs.Content><Tabs.Content value="f5">
                <div className={className}>{f5}</div>
            </Tabs.Content><Tabs.Content value="61">
                <div className={className}>{f61}</div>
            </Tabs.Content><Tabs.Content value="62">
                <div className={className}>{f62}</div>
            </Tabs.Content>
        </Tabs.Root>

    </div>);
}