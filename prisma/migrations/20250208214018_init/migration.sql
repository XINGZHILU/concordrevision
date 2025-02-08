/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "createdAt",
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;
