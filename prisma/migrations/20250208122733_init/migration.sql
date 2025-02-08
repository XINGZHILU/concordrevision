/*
  Warnings:

  - The `amber` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `green` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `red` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "amber",
ADD COLUMN     "amber" INTEGER[],
DROP COLUMN "green",
ADD COLUMN     "green" INTEGER[],
DROP COLUMN "red",
ADD COLUMN     "red" INTEGER[];
