import Link from "next/link";

export default function Page() {
    const uploadOptions = [
        {
            title: "Revision Resources",
            description: "Upload notes, practice questions, and study materials for revision",
            href: "/upload/revision/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            bgColor: "bg-primary/5",
            borderColor: "border-primary/10",
            hoverBg: "hover:bg-primary/10"
        },
        {
            title: "Olympiad Resources",
            description: "Upload competition materials, problem sets, and advanced practice for olympiads",
            href: "/upload/olympiads/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            bgColor: "bg-purple-500/5",
            borderColor: "border-purple-500/10",
            hoverBg: "hover:bg-purple-500/10"
        },
        {
            title: "UCAS Posts",
            description: "Share advice on personal statements, interviews, and university applications.",
            href: "/upload/ucas",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            bgColor: "bg-sky-500/5",
            borderColor: "border-sky-500/10",
            hoverBg: "hover:bg-sky-500/10"
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                        Upload Resources
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Select the type of educational materials you would like to upload
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {uploadOptions.map((option, index) => (
                        <Link
                            key={index}
                            href={option.href}
                            className={`flex flex-col h-full rounded-lg shadow-sm border ${option.borderColor} ${option.bgColor} ${option.hoverBg} transition-colors duration-150 overflow-hidden`}
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm mx-auto mb-6">
                                    {option.icon}
                                </div>
                                <h2 className="text-xl font-semibold text-foreground text-center mb-3">
                                    {option.title}
                                </h2>
                                <p className="text-muted-foreground text-center flex-1">
                                    {option.description}
                                </p>
                            </div>
                            <div className="py-4 px-6 bg-background border-t border-border flex justify-center">
                                <span className="inline-flex items-center text-primary font-medium">
                                    Select
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}