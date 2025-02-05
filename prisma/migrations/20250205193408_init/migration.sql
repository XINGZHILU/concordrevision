/*
  Warnings:

  - You are about to drop the column `filename` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "filename",
ALTER COLUMN "desc" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "desc" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Olympiad" ALTER COLUMN "desc" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Olympiad_Resource" ALTER COLUMN "desc" SET DEFAULT '';
