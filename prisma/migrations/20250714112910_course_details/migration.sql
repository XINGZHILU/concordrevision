/*
  Warnings:

  - Added the required column `duration` to the `CourseLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CourseLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `CourseLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ucascode` to the `CourseLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "CourseLink" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "entry_requirements" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "ucascode" TEXT NOT NULL,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
