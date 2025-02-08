/*
  Warnings:

  - You are about to drop the column `sat_test` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "sat_test",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;
