-- CreateTable
CREATE TABLE "PastPaperRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "specimen" BOOLEAN NOT NULL DEFAULT true,
    "start_year" INTEGER NOT NULL DEFAULT 2015,
    "paper_count" INTEGER NOT NULL DEFAULT 3,
    "papers_finished" INTEGER[],

    CONSTRAINT "PastPaperRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PastPaperRecord" ADD CONSTRAINT "PastPaperRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastPaperRecord" ADD CONSTRAINT "PastPaperRecord_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
