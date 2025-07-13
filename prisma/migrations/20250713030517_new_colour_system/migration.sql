/*
  Warnings:

  - You are about to drop the column `amber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `green` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `red` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "amber",
DROP COLUMN "green",
DROP COLUMN "red";
