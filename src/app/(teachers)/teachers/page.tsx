import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function TeachersPage() {
  const user = await currentUser();

  const pendingNotesCount = await prisma.note.count({
    where: { approved: false },
  });

  const pendingOlympiadResourcesCount = await prisma.olympiad_Resource.count({
    where: { approved: false },
  });

  const userNotes = user ? await prisma.note.findMany({
    where: { authorId: user.id, testId: { not: null } },
    select: { testId: true },
    distinct: ['testId'],
  }) : [];

  const testIds = userNotes.map(note => note.testId).filter((id): id is number => id !== null);

  const contributedTests = testIds.length > 0 ? await prisma.test.findMany({
    where: {
      id: {
        in: testIds,
      },
    },
    include: {
      subject: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: 5,
  }) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.firstName || 'Teacher'}! Here&apos;s an overview of what&apos;s happening.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingNotesCount + pendingOlympiadResourcesCount}</div>
            <p className="text-xs text-muted-foreground">{pendingNotesCount} notes & {pendingOlympiadResourcesCount} olympiad resources</p>
            <Button asChild className="mt-4">
              <Link href="/teachers/approval">Review Content</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule a Test</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Create and schedule new tests for different subjects.</p>
            <Button asChild className="mt-4">
              <Link href="/teachers/create-test">Create New Test</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Tests You&apos;ve Contributed To</h2>
        {contributedTests.length > 0 ? (
          <div className="space-y-4">
            {contributedTests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{test.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {test.subject.title} - {new Date(test.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/revision/${test.subject.title}/tests/${test.id}`}>View Test</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">You haven&apos;t contributed to any tests yet.</p>
            <Button asChild variant="secondary" className="mt-4">
                <Link href="/upload">Upload Notes</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 