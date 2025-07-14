import Link from 'next/link';

export default function UcasPage() {
  const ucasOptions = [
    {
      title: "University Finder",
      description: "Explore universities and the courses they offer.",
      href: "/ucas/schools",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
      bgColor: "bg-primary/5",
      borderColor: "border-primary/10",
      hoverBg: "hover:bg-primary/10"
    },
    {
      title: "Course Finder",
      description: "Find the perfect course for you and see where it's offered.",
      href: "/ucas/courses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/10",
      hoverBg: "hover:bg-purple-500/10"
    },
    {
      title: "Posts",
      description: "Read what other students have to say about their experiences.",
      href: "/ucas/posts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" />
        </svg>
      ),
      bgColor: "bg-sky-500/5",
      borderColor: "border-sky-500/10",
      hoverBg: "hover:bg-sky-500/10"
    }
  ];

  return (
    <div className='w-11/12 mx-auto'>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          UCAS Application Helper
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tools and resources to help you with your university application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ucasOptions.map((option, index) => (
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
                Explore
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}