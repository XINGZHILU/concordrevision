/*
  Warnings:

  - You are about to drop the column `files` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `Olympiad_Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "files";

-- AlterTable
ALTER TABLE "Olympiad_Resource" DROP COLUMN "files";

-- CreateTable
CREATE TABLE "StorageFile" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'pdf',
    "path" TEXT NOT NULL,
    "noteId" INTEGER,
    "olympiadId" INTEGER,

    CONSTRAINT "StorageFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StorageFile" ADD CONSTRAINT "StorageFile_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageFile" ADD CONSTRAINT "StorageFile_olympiadId_fkey" FOREIGN KEY ("olympiadId") REFERENCES "Olympiad_Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
