/*
  Warnings:

  - Made the column `url` on table `UcasCourse` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UcasCourse" ALTER COLUMN "url" SET NOT NULL;
