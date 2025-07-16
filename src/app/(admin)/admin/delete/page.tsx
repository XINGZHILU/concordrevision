import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LuBook, LuMedal, LuNewspaper } from "react-icons/lu";

export default function AdminDeletePage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Delete Resources</h1>
            <p className="text-muted-foreground mb-8">Select a category to view and delete resources.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link href="/admin/delete/revision" className="block">
                    <Card className="hover:border-primary transition-colors h-full">
                        <CardHeader>
                            <div className="flex items-center mb-4">
                                <LuBook className="mr-4 h-8 w-8 text-primary" />
                                <CardTitle className="text-2xl">Revision Notes</CardTitle>
                            </div>
                            <CardDescription>Delete revision notes by subject and year group.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/admin/delete/olympiads" className="block">
                    <Card className="hover:border-primary transition-colors h-full">
                        <CardHeader>
                            <div className="flex items-center mb-4">
                                <LuMedal className="mr-4 h-8 w-8 text-primary" />
                                <CardTitle className="text-2xl">Olympiad Resources</CardTitle>
                            </div>
                            <CardDescription>Delete resources for each olympiad.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/admin/delete/ucas" className="block">
                    <Card className="hover:border-primary transition-colors h-full">
                        <CardHeader>
                            <div className="flex items-center mb-4">
                                <LuNewspaper className="mr-4 h-8 w-8 text-primary" />
                                <CardTitle className="text-2xl">UCAS Posts</CardTitle>
                            </div>
                            <CardDescription>Manage all user-submitted UCAS posts and advice.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
} 