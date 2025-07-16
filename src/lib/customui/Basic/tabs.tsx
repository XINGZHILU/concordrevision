import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SubjectTabs({ f3, f4, f5, f61, f62, defaultval }: {
    f3: React.JSX.Element[],
    f4: React.JSX.Element[],
    f5: React.JSX.Element[],
    f61: React.JSX.Element[],
    f62: React.JSX.Element[],
    defaultval: string
}) {
    const className = 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue={defaultval}>
            <TabsList>
                <TabsTrigger value="f3">Form 3</TabsTrigger>
                <TabsTrigger value="f4">Form 4</TabsTrigger>
                <TabsTrigger value="f5">Form 5</TabsTrigger>
                <TabsTrigger value="61">6.1</TabsTrigger>
                <TabsTrigger value="62">6.2</TabsTrigger>
            </TabsList>
            <TabsContent value="f3">
                <div className={className}>{f3}</div>
            </TabsContent>
            <TabsContent value="f4">
                <div className={className}>{f4}</div>
            </TabsContent>
            <TabsContent value="f5">
                <div className={className}>{f5}</div>
            </TabsContent>
            <TabsContent value="61">
                <div className={className}>{f61}</div>
            </TabsContent>
            <TabsContent value="62">
                <div className={className}>{f62}</div>
            </TabsContent>
        </Tabs>
    </div>);
}