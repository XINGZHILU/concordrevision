import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getVisibleYearGroups } from "@/lib/year-group-config"

export function SubjectTabs({ f3, f4, f5, f61, f62, defaultval }: {
    f3: React.JSX.Element[],
    f4: React.JSX.Element[],
    f5: React.JSX.Element[],
    f61: React.JSX.Element[],
    f62: React.JSX.Element[],
    defaultval: string
}) {
    const className = 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    const visibleYearGroups = getVisibleYearGroups();
    
    // Map content arrays to year group levels
    const contentMap: { [key: number]: React.JSX.Element[] } = {
        0: f3,   // Form 3
        1: f4,   // Form 4  
        2: f5,   // Form 5
        3: f61,  // 6.1
        4: f62   // 6.2
    };

    // Find first visible tab for default if current default is not visible
    const firstVisibleTab = visibleYearGroups.length > 0 ? visibleYearGroups[0].tabId : 'f3';
    const isDefaultVisible = visibleYearGroups.some(group => group.tabId === defaultval);
    const actualDefault = isDefaultVisible ? defaultval : firstVisibleTab;

    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue={actualDefault}>
            <TabsList>
                {visibleYearGroups.map(group => (
                    <TabsTrigger key={group.tabId} value={group.tabId}>
                        {group.name}
                    </TabsTrigger>
                ))}
            </TabsList>
            {visibleYearGroups.map(group => (
                <TabsContent key={group.tabId} value={group.tabId}>
                    <div className={className}>{contentMap[group.level] || []}</div>
                </TabsContent>
            ))}
        </Tabs>
    </div>);
}