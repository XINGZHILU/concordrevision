/*
  Warnings:

  - You are about to drop the column `coruses` on the `UCASPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UCASPost" DROP COLUMN "coruses",
ADD COLUMN     "courses" TEXT[];
