import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubjectTabs } from '@/lib/customui/Basic/tabs';
import { getYearGroupName } from '@/lib/year-group-config';

export default async function CreateTestSubjectSelectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';

  const subjects = await prisma.subject.findMany({
    where: {
      title: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    orderBy: {
      title: 'asc',
    },
  });

  const createSubjectCard = (subject: typeof subjects[0]) => (
    <Link
      key={subject.id}
      href={`/teachers/create-test/${subject.id}`}
      className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card text-card-foreground"
    >
      <h3 className="text-lg font-semibold">{getYearGroupName(subject.level)} {subject.title}</h3>
    </Link>
  );

  const f3 = subjects.filter((subject) => subject.level === 0).map(createSubjectCard);
  const f4 = subjects.filter((subject) => subject.level === 1).map(createSubjectCard);
  const f5 = subjects.filter((subject) => subject.level === 2).map(createSubjectCard);
  const f61 = subjects.filter((subject) => subject.level === 3).map(createSubjectCard);
  const f62 = subjects.filter((subject) => subject.level === 4).map(createSubjectCard);

  const defaultTab = 'f3'; // You can enhance this to be dynamic based on user profile or other logic

  return (
    <div>
      <h1 className="text-2xl font-bold">Create a Test</h1>
      <p className="mt-2 text-muted-foreground">Select a subject to create a test for.</p>

      <form method="GET" className="mt-6 flex flex-col sm:flex-row gap-4">
        <Input
          type="search"
          name="q"
          placeholder="Search by subject name..."
          defaultValue={searchTerm}
          className="max-w-xs"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-6">
        <SubjectTabs
          f3={f3}
          f4={f4}
          f5={f5}
          f61={f61}
          f62={f62}
          defaultval={defaultTab}
        />
      </div>
    </div>
  );
} 