/*
  Warnings:

  - You are about to drop the column `courseId` on the `UCASPost` table. All the data in the column will be lost.
  - You are about to drop the column `universityId` on the `UCASPost` table. All the data in the column will be lost.
  - You are about to drop the `UcasCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('STEM', 'Law_Humanities', 'Languages', 'Medicine', 'Art');

-- DropForeignKey
ALTER TABLE "UCASPost" DROP CONSTRAINT "UCASPost_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UCASPost" DROP CONSTRAINT "UCASPost_universityId_fkey";

-- DropForeignKey
ALTER TABLE "UcasCourse" DROP CONSTRAINT "UcasCourse_universityId_fkey";

-- DropIndex
DROP INDEX "University_name_idx";

-- DropIndex
DROP INDEX "University_name_key";

-- AlterTable
ALTER TABLE "UCASPost" DROP COLUMN "courseId",
DROP COLUMN "universityId",
ADD COLUMN     "coruses" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "universities" TEXT[];

-- DropTable
DROP TABLE "UcasCourse";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CourseType" NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLink" (
    "id" SERIAL NOT NULL,
    "universityId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseLink" ADD CONSTRAINT "CourseLink_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLink" ADD CONSTRAINT "CourseLink_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
