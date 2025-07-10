/*
  Warnings:

  - Added the required column `shorthand` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "University_name_idx";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "shorthand" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "University_name_idx" ON "University"("name");
