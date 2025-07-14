import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { UCASPostList } from '@/lib/customui/UCAS/UCASPostList';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdmissionStats } from '@prisma/client';

function AdmissionStatsTable({ stats }: { stats: AdmissionStats[] }) {
    if (stats.length === 0) {
        return <p>No admission statistics available.</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admission Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead className="text-right">Applicants</TableHead>
                            <TableHead className="text-right">Offers</TableHead>
                            <TableHead className="text-right">Offer Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats.sort((a,b) => b.year - a.year).map((stat) => (
                            <TableRow key={stat.id}>
                                <TableCell className="font-medium">{stat.year}</TableCell>
                                <TableCell className="text-right">{stat.applied}</TableCell>
                                <TableCell className="text-right">{stat.accepted}</TableCell>
                                <TableCell className="text-right">{stat.applied > 0 ? `${((stat.accepted / stat.applied) * 100).toFixed(1)}%` : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export default async function UniversityPage({ params }: { params: { uid: string } }) {
  const university = await prisma.university.findUnique({
    where: {
      id: params.uid
    },
    include: {
      courseLinks: {
        include: {
          course: true
        }
      },
      stats: true,
    }
  });

  if (!university) {
    notFound();
  }

  const posts = await prisma.uCASPost.findMany({
    where: {
      universities: {
        has: university.name
      }
    },
    include: {
      author: true
    }
  });

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-4xl font-bold my-8">{university.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">About</h2>
            <div className="prose dark:prose-invert max-w-none">
                <p>{university.description}</p>
            </div>
        </div>
        <div>
            <AdmissionStatsTable stats={university.stats} />
        </div>
      </div>


      <h2 className="text-3xl font-bold my-8">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {university.courseLinks.map(courseLink => (
          <Link
            href={`/ucas/schools/${university.id}/${courseLink.id}`}
            key={courseLink.id}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{courseLink.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {courseLink.course.name}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl font-bold my-8">Relevant Posts</h2>
      <UCASPostList posts={posts} />
    </div>
  );
}