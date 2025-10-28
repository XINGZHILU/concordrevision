import Terms from '@/lib/markdown/terms.mdx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions - Concordpedia',
  description: 'Terms and Conditions for using Concordpedia, the educational platform for Concord College, Shrewsbury.',
}

/**
 * Terms and Conditions page
 * Displays the legal terms for using the Concordpedia platform
 */
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Terms />
      </div>
    </div>
  );
}