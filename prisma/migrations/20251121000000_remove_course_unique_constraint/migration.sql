/*
  Warnings:

  - A unique constraint covering the columns `[universityId,ucasSubjectId]` on the table `Course` will be removed.

*/
-- Drop the unique constraint
ALTER TABLE "Course" DROP CONSTRAINT IF EXISTS "Course_universityId_ucasSubjectId_key";

