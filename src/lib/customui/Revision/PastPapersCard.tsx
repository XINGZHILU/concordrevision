import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * A banner component that provides a link to the past paper records page.
 * @returns {JSX.Element} The rendered past papers banner.
 */
export default function PastPapersCard() {
    return (
        <div className="w-full bg-muted rounded-lg p-4 flex items-center justify-between">
            <div>
                <h3 className="font-semibold">Past Paper Practice</h3>
                <p className="text-sm text-muted-foreground">
                    Review your performance on past papers.
                </p>
            </div>
            <Link href="/revision/practice/ppq/records" passHref>
                <Button>View Records</Button>
            </Link>
        </div>
    );
} 