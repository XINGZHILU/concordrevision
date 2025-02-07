/*
  Warnings:

  - Added the required column `area` to the `Olympiad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Olympiad" ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "links" TEXT[];
