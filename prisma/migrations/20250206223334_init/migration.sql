/*
  Warnings:

  - You are about to drop the column `favouriteUIDs` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "favouriteUIDs",
ADD COLUMN     "amberUIDs" TEXT[],
ADD COLUMN     "greenUIDs" TEXT[],
ADD COLUMN     "redUIDs" TEXT[];
