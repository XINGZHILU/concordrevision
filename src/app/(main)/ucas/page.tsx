import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UcasPage() {
  return (
    <div className='w-11/12 mx-auto'>
      <h1 className="text-4xl font-bold my-8">UCAS Application Helper</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/ucas/school">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>School & Course Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Explore universities and courses. Find the best fit for you.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ucas/post">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Read what other students have to say about their experiences.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}