import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RevisionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative">
            <div className="sticky top-16 z-10 bg-background border-b border-border mb-6">
                <div className="container mx-auto py-3 px-4">
                    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Link
                            href="/revision"
                            className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Subjects
                        </Link>

                        <div className="w-px h-5 bg-border"></div>

                        <div className="text-sm font-medium text-muted-foreground">
                            Past Papers:
                        </div>

                        <Button variant="link" asChild>
                            <Link
                                href="/revision/practice/ppq/records"
                                className="text-sm flex items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                View Records
                            </Link>
                        </Button>

                        <Button variant="link" asChild>
                            <Link
                                href="/revision/practice/ppq"
                                className="text-sm flex items-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Create New Record
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {children}
            </div>
        </div>
    )
} 