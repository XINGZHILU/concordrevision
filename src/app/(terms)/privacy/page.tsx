import Privacy from '@/lib/markdown/privacy.mdx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Concordpedia',
  description: 'Privacy Policy for Concordpedia, detailing how we collect, use, and protect your personal information.',
}

/**
 * Privacy Policy page
 * Displays the privacy policy and data protection information for the Concordpedia platform
 */
export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Privacy />
      </div>
    </div>
  );
}