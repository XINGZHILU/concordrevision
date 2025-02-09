/*
  Warnings:

  - Added the required column `authorId` to the `Olympiad_Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Olympiad_Resource" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Olympiad_Resource" ADD CONSTRAINT "Olympiad_Resource_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
