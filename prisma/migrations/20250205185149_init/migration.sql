/*
  Warnings:

  - You are about to drop the column `noteId` on the `Test` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_noteId_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "testId" INTEGER,
ALTER COLUMN "type" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "noteId",
ALTER COLUMN "desc" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE SET NULL ON UPDATE CASCADE;
