import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UcasPage() {
  
  return (
    <div className="w-11/12 mx-auto mt-8">
      <h1 className="text-4xl font-bold text-center mb-12">UCAS Hub</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/ucas/finder">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>School & Course Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse universities and courses. Compare entry requirements and find your perfect fit.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ucas/advice">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>UCAS Advice & Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Read and share advice on personal statements, interviews, and university life.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}