/*
  Warnings:

  - You are about to drop the column `filename` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Olympiad_Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "filename",
ADD COLUMN     "files" TEXT[];

-- AlterTable
ALTER TABLE "Olympiad_Resource" DROP COLUMN "filename",
ADD COLUMN     "files" TEXT[];
