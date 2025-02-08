/*
  Warnings:

  - You are about to drop the column `amberUIDs` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `greenUIDs` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `redUIDs` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "amberUIDs",
DROP COLUMN "greenUIDs",
DROP COLUMN "redUIDs";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "amber" TEXT[],
ADD COLUMN     "green" TEXT[],
ADD COLUMN     "red" TEXT[];
