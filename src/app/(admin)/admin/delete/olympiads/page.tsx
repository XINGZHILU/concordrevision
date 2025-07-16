import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDeleteOlympiadsPage() {
    const olympiads = await prisma.olympiad.findMany({
        orderBy: { title: 'asc' }
    });

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-2">Delete Olympiad Resources</h1>
            <p className="text-muted-foreground mb-8">Select an olympiad to view and delete its resources.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {olympiads.map(olympiad => (
                    <Link key={olympiad.id} href={`/admin/delete/olympiads/${olympiad.id}`} className="block">
                        <Card className="hover:border-primary transition-colors h-full">
                            <CardHeader>
                                <CardTitle className="text-base">{olympiad.title}</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
} 