-- AlterTable
ALTER TABLE "StorageFile" ADD COLUMN     "ucasPostId" INTEGER;

-- CreateTable
CREATE TABLE "UCASPost" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "universityId" TEXT,
    "courseId" TEXT,
    "authorId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UCASPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StorageFile" ADD CONSTRAINT "StorageFile_ucasPostId_fkey" FOREIGN KEY ("ucasPostId") REFERENCES "UCASPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UCASPost" ADD CONSTRAINT "UCASPost_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UCASPost" ADD CONSTRAINT "UCASPost_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "UcasCourse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UCASPost" ADD CONSTRAINT "UCASPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
