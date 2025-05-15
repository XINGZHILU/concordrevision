import About from '@/lib/markdown/about.mdx'

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <About />
            </div>
        </div>
    );
}