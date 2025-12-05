import { prisma } from "@/lib/prisma";
import FilterableRevisionSubjectList from "@/lib/customui/Revision/FilterableRevisionSubjectList";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent } from '@/lib/components/ui/card';
import Link from "next/link";
import { Button } from '@/lib/components/ui/button';
import { BookCheck, MessageSquare } from "lucide-react";

const QuickActions = () => (
    <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/revision/chat" className="w-full">
                <Button variant="outline" className="w-full h-full justify-start p-4">
                    <div className="flex items-center gap-4">
                        <MessageSquare className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-semibold text-left">AI Revision Assistant</p>
                            <p className="text-sm text-muted-foreground text-left">Chat with our AI</p>
                        </div>
                    </div>
                </Button>
            </Link>
            <Link href="/revision/practice/ppq/records" className="w-full">
                <Button variant="outline" className="w-full h-full justify-start p-4">
                    <div className="flex items-center gap-4">
                        <BookCheck className="w-8 h-8 text-primary" />
                        <div>
                            <p className="font-semibold text-left">Past Paper Records</p>
                            <p className="text-sm text-muted-foreground text-left">Review your performance</p>
                        </div>
                    </div>
                </Button>
            </Link>
        </CardContent>
    </Card>
);


export default async function Home() {
    const subjects = await prisma.subject.findMany({
        orderBy: {
            title: 'asc'
        }
    });

    const user = await currentUser();
    if (!user) {
        return (
            <div className="space-y-8">
                <QuickActions />
                <FilterableRevisionSubjectList
                    subjects={subjects}
                    year={0}
                    userSubscriptions={[]}
                    isAuthenticated={false}
                />
            </div>
        )
    }

    const user_data = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!user_data) {
        return <h1>User not found</h1>;
    }

    // Fetch user subscriptions
    const userSubscriptions = await prisma.userSubjectSubscription.findMany({
        where: {
            userId: user.id
        },
        select: {
            subjectId: true
        }
    });

    const subscribedSubjectIds = userSubscriptions.map(sub => sub.subjectId);

    return (
        <div className="space-y-8">
            { /* <QuickActions /> */}
            <FilterableRevisionSubjectList
                subjects={subjects}
                year={user_data.year}
                userSubscriptions={subscribedSubjectIds}
                isAuthenticated={true}
            />
        </div>
    )
}
