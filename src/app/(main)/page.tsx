import UpcomingExams from "@/lib/customui/Basic/UpcomingExams";

export default async function Home() {
  return (
    <>
      <header className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 -z-10 animate-gradient-xy"></div>
        <div className="container mx-auto px-4 text-center">
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground'>
            Welcome!
          </h1>
          <div className="mt-6">
            {/* UpcomingExams accepts optional maxDates prop (default: 8) */}
            {/* Will display in rows of 4 columns each */}
            {/* Example: <UpcomingExams maxDates={12} /> for 3 rows */}
            <UpcomingExams />
          </div>
        </div>
      </header>
    </>
  )
}
